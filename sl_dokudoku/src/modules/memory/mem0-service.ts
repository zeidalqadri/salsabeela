export class Mem0Service {
  // Add context compression
  async compressContext(context: string): Promise<string> {
    const compressed = await mem0.compress(context);
    return compressed;
  }

  // Add memory summarization
  async summarizeMemory(userId: string): Promise<string> {
    const memory = await mem0.getMemory(userId);
    const summary = await mem0.summarize(memory);
    return summary;
  }

  // Add memory search
  async searchMemory(userId: string, query: string): Promise<any> {
    const results = await mem0.search(userId, query);
    return results;
  }

  // Add memory compression
  async compressMemory(userId: string): Promise<void> {
    const memory = await mem0.getMemory(userId);
    const compressed = await mem0.compress(memory);
    await mem0.updateMemory(userId, compressed);
  }

  // Add memory tagging
  async tagMemory(userId: string, tags: string[]): Promise<void> {
    await mem0.tagMemory(userId, tags);
  }

  // Add memory search with filters
  async searchMemoryWithFilters(
    userId: string, 
    query: string,
    filters: { tags?: string[], dateRange?: { start: Date, end: Date } }
  ): Promise<any> {
    return mem0.search(userId, query, filters);
  }

  // Add memory compression with chunking
  async compressMemoryWithChunking(userId: string, chunkSize = 1000): Promise<void> {
    const memory = await mem0.getMemory(userId);
    const chunks = this.chunkText(memory, chunkSize);
    
    for (const chunk of chunks) {
      const compressed = await mem0.compress(chunk);
      await mem0.updateMemory(userId, compressed);
    }
  }

  // Add memory search with relevance scoring
  async searchMemoryWithRelevance(
    userId: string,
    query: string,
    threshold = 0.7
  ): Promise<{ text: string, score: number }[]> {
    const results = await mem0.search(userId, query);
    return results.filter(r => r.score >= threshold);
  }

  // Add memory summarization with length control
  async summarizeMemoryWithLength(
    userId: string,
    maxLength = 500
  ): Promise<string> {
    const memory = await mem0.getMemory(userId);
    const summary = await mem0.summarize(memory);
    return summary.slice(0, maxLength);
  }

  // Helper function for text chunking
  private chunkText(text: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }
} 