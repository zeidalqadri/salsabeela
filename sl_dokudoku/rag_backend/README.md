# DokuDoku RAG Backend

This is the RAG (Retrieval-Augmented Generation) backend service for DokuDoku. It provides document processing, semantic search, and summarization capabilities using LangChain, FastAPI, and pgvector.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://localhost:5432/dokudoku
   OPENAI_API_KEY=your_openai_api_key_here
   MODEL_NAME=gpt-3.5-turbo
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   CHUNK_SIZE=1000
   CHUNK_OVERLAP=200
   ```

3. Make sure PostgreSQL is running and the pgvector extension is installed.

## Running the Service

Start the FastAPI server:
```bash
cd src
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /rag/process/{document_id}`: Process a document and store its chunks
- `POST /rag/query`: Query documents using natural language
- `GET /rag/summarize/{document_id}`: Generate a summary for a document

## Development

The project structure is organized as follows:

```
src/
├── api/          # API routes
├── core/         # Core configuration
├── db/           # Database setup
├── models/       # Data models
├── services/     # Business logic
└── main.py       # FastAPI application
```

## Features

- Document Processing: Extract text from PDF and text files, chunk content, and generate embeddings
- Semantic Search: Find relevant document chunks using vector similarity search
- Question Answering: Get AI-generated answers based on document content
- Document Summarization: Generate concise summaries of documents

## Prerequisites

- Python 3.11+
- PostgreSQL with pgvector extension installed
- OpenAI API key for LLM functionality

## Integration with Next.js Frontend

The RAG backend is designed to work with the DokuDoku Next.js frontend. Configure the frontend to send requests to the appropriate endpoints:

1. Document Upload: After uploading a document to the main app, call the process endpoint
2. Search/QA: Use the query endpoint from the search interface
3. Summarization: Add a summarize button/action that calls the summarize endpoint

## Error Handling

The API includes comprehensive error handling:
- 404: Document not found
- 500: Processing/internal errors
- Validation errors for invalid requests

## Future Improvements

- Add support for more document types (DOCX, HTML, etc.)
- Implement background processing for large documents
- Add caching for frequently accessed embeddings
- Support for custom embedding models
- Integration with Ollama for local LLM deployment 