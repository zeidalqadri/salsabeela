from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List
from pydantic import BaseModel
from db.database import get_db
from services.rag_service import RAGService

router = APIRouter(prefix="/rag", tags=["rag"])

class Query(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, str]]

@router.post("/process/{document_id}")
async def process_document(
    document_id: str,
    file_path: str,
    file_type: str,
    db: Session = Depends(get_db)
):
    """Process a document and store its chunks in the vector store."""
    try:
        rag_service = RAGService(db)
        await rag_service.process_document(document_id, file_path, file_type)
        return {"message": "Document processed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query_documents(
    query: Query,
    db: Session = Depends(get_db)
):
    """Query the documents using RAG."""
    try:
        rag_service = RAGService(db)
        result = await rag_service.query_documents(query.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summarize/{document_id}")
async def summarize_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Generate a summary for a document."""
    try:
        rag_service = RAGService(db)
        summary = await rag_service.summarize_document(document_id)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 