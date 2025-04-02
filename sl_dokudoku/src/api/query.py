from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db.database import get_db
from ..services.document_processor import DocumentProcessor
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from typing import List, Optional
from pydantic import BaseModel
import numpy as np
import os

router = APIRouter()
processor = DocumentProcessor()

# Initialize OpenAI LLM
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Define query request model
class QueryRequest(BaseModel):
    query: str
    k: int = 4  # Number of chunks to retrieve

# Define the QA prompt template
qa_template = """Answer the question based on the following context. If you cannot find the answer in the context, say "I cannot answer this question based on the provided context."

Context:
{context}

Question: {question}

Answer:"""

qa_prompt = PromptTemplate(
    template=qa_template,
    input_variables=["context", "question"]
)

# Create the QA chain
qa_chain = LLMChain(llm=llm, prompt=qa_prompt)

@router.post("/query")
async def query_documents(
    request: QueryRequest,
    db: Session = Depends(get_db)
):
    try:
        # Generate embedding for the query
        query_embedding = processor.embeddings.embed_query(request.query)
        
        # Perform similarity search using pgvector
        # Note: This requires the pgvector extension and appropriate index
        query = text("""
            SELECT chunk_text, 1 - (embedding <=> :query_embedding) as similarity
            FROM document_chunks
            ORDER BY embedding <=> :query_embedding
            LIMIT :k
        """)
        
        results = db.execute(
            query,
            {
                "query_embedding": query_embedding,
                "k": request.k
            }
        ).fetchall()
        
        if not results:
            return {
                "answer": "No relevant documents found.",
                "context": []
            }
        
        # Prepare context from retrieved chunks
        context = "\n\n".join([chunk.chunk_text for chunk in results])
        
        # Generate answer using LLM
        response = qa_chain.run(context=context, question=request.query)
        
        return {
            "answer": response,
            "context": [
                {
                    "text": chunk.chunk_text,
                    "similarity": float(chunk.similarity)
                }
                for chunk in results
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 