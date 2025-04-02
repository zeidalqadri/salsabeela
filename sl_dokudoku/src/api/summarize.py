from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from langchain_openai import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document
from typing import List
import os

router = APIRouter()

# Initialize OpenAI LLM
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

@router.post("/summarize/{document_id}")
async def summarize_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    try:
        # Fetch all chunks for the document
        chunks = db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).order_by(DocumentChunk.chunk_index).all()
        
        if not chunks:
            raise HTTPException(status_code=404, detail="Document not found or not processed")
        
        # Convert chunks to LangChain documents
        documents = [
            Document(page_content=chunk.chunk_text)
            for chunk in chunks
        ]
        
        # Initialize summarization chain with map_reduce for longer documents
        chain = load_summarize_chain(
            llm,
            chain_type="map_reduce",
            map_prompt="""Write a concise summary of the following text:
            "{text}"
            CONCISE SUMMARY:""",
            combine_prompt="""Combine the following summaries into a single coherent summary:
            "{text}"
            COMBINED SUMMARY:"""
        )
        
        # Generate summary
        summary = chain.run(documents)
        
        return {
            "document_id": document_id,
            "summary": summary
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 