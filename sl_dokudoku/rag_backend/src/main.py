from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from api.rag import router as rag_router

settings = get_settings()

app = FastAPI(title="DokuDoku RAG API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rag_router)

@app.get("/")
async def root():
    return {"message": "DokuDoku RAG API is running"}
