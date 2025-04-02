from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..services.document_processor import DocumentProcessor
from ..models.document_chunks import DocumentChunk
from typing import List
import os

router = APIRouter()
processor = DocumentProcessor()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")

@router.post("/process/{document_id}")
async def process_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    try:
        document_path = os.path.join(UPLOAD_DIR, document_id)
        
        if not os.path.exists(document_path):
            raise HTTPException(status_code=404, detail="Document file not found")
        
        # Process document
        chunks, embeddings = processor.process_document(document_path)
        
        # Store chunks and embeddings
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            db_chunk = DocumentChunk(
                document_id=document_id,
                chunk_index=idx,
                chunk_text=chunk,
                embedding=embedding
            )
            db.add(db_chunk)
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Document processed successfully. Created {len(chunks)} chunks.",
            "document_id": document_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 