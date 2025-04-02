import { LangfuseService } from "@/modules/observability/langfuse-service";
import { describe, it, expect, vi } from "vitest";

describe("LangfuseService", () => {
  const service = new LangfuseService();

  it("should track LLM call with metadata", async () => {
    const mockTrace = vi.fn().mockResolvedValue({ id: "trace1" });
    service.trace = mockTrace;

    const trace = await service.traceLLMCallWithMetadata(
      "prompt",
      { model: "deepseek", usage: { tokens: 100 } },
      { userId: "user1" }
    );
    
    expect(trace.id).toBe("trace1");
    expect(mockTrace).toHaveBeenCalled();
  });

  it("should track error with context", async () => {
    const mockTrace = vi.fn().mockResolvedValue(true);
    service.trace = mockTrace;

    const error = new Error("Test error");
    await service.trackErrorWithContext(error, { userId: "user1" }, "high");
    
    expect(mockTrace).toHaveBeenCalled();
  });
}); 