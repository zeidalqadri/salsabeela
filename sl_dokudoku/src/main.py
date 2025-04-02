from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
from .db.database import init_db
from .api import process, query, summarize
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="DokuDoku RAG API",
    description="RAG backend for DokuDoku document management system",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(process.router, prefix="/api/rag", tags=["document-processing"])
app.include_router(query.router, prefix="/api/rag", tags=["querying"])
app.include_router(summarize.router, prefix="/api/rag", tags=["summarization"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "RAG API is running"}

# Startup event to initialize database
@app.on_event("startup")
async def startup_event():
    init_db()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 