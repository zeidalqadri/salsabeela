import { Mem0Service } from "@/modules/memory/mem0-service";
import { describe, it, expect, vi } from "vitest";

describe("Mem0Service", () => {
  const service = new Mem0Service();

  it("should compress memory with chunking", async () => {
    const mockCompress = vi.fn().mockResolvedValue("compressed");
    const mockUpdate = vi.fn().mockResolvedValue(true);
    
    service.compress = mockCompress;
    service.updateMemory = mockUpdate;

    await service.compressMemoryWithChunking("user1", 1000);
    
    expect(mockCompress).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should search memory with relevance", async () => {
    const mockSearch = vi.fn().mockResolvedValue([
      { text: "result1", score: 0.8 },
      { text: "result2", score: 0.6 }
    ]);
    
    service.search = mockSearch;

    const results = await service.searchMemoryWithRelevance("user1", "query", 0.7);
    
    expect(results.length).toBe(1);
    expect(results[0].text).toBe("result1");
  });
}); 