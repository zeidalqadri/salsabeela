interface QueryResponse {
  answer: string;
  sources: { text: string }[];
}

interface SummaryResponse {
  summary: string;
}

class RagClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://localhost:8000';
  }

  async processDocument(documentId: string, filePath: string, fileType: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/rag/process/${documentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_path: filePath, file_type: fileType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to process document');
    }
  }

  async queryDocuments(query: string): Promise<QueryResponse> {
    const response = await fetch(`${this.baseUrl}/rag/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to query documents');
    }

    return response.json();
  }

  async summarizeDocument(documentId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/rag/summarize/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to summarize document');
    }

    const data: SummaryResponse = await response.json();
    return data.summary;
  }
}

export const ragClient = new RagClient(); 