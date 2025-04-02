from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import List, Optional
import os

class DocumentProcessor:
    def __init__(self):
        # Initialize text splitter with default settings
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # Initialize embedding model
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

    def load_document(self, file_path: str) -> str:
        """Load document content from file."""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.pdf':
                loader = PyMuPDFLoader(file_path)
                documents = loader.load()
                return '\n'.join(doc.page_content for doc in documents)
            elif file_extension in ['.txt', '.md']:
                loader = TextLoader(file_path)
                documents = loader.load()
                return documents[0].page_content
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        except Exception as e:
            raise Exception(f"Error loading document: {str(e)}")

    def split_text(self, text: str) -> List[str]:
        """Split text into chunks."""
        try:
            chunks = self.text_splitter.split_text(text)
            return chunks
        except Exception as e:
            raise Exception(f"Error splitting text: {str(e)}")

    def generate_embeddings(self, chunks: List[str]) -> List[List[float]]:
        """Generate embeddings for text chunks."""
        try:
            embeddings = self.embeddings.embed_documents(chunks)
            return embeddings
        except Exception as e:
            raise Exception(f"Error generating embeddings: {str(e)}")

    def process_document(self, file_path: str) -> tuple[List[str], List[List[float]]]:
        """Process document: load, split, and generate embeddings."""
        # Load document
        text = self.load_document(file_path)
        
        # Split into chunks
        chunks = self.split_text(text)
        
        # Generate embeddings
        embeddings = self.generate_embeddings(chunks)
        
        return chunks, embeddings 