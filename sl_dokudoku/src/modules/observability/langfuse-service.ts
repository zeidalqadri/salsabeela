export class LangfuseService {
  // Add detailed tracing with metadata
  async traceLLMCallWithMetadata(
    prompt: string,
    response: any,
    metadata: Record<string, any>
  ) {
    const trace = langfuse.trace({
      name: "LLM Call",
      input: prompt,
      output: response,
      metadata: {
        ...metadata,
        model: response.model,
        tokens: response.usage
      }
    });

    return trace;
  }

  // Add error tracking with context
  async trackErrorWithContext(
    error: Error,
    context: any,
    severity: "low" | "medium" | "high" = "medium"
  ) {
    await langfuse.trace({
      name: "Error",
      input: context,
      output: error.message,
      level: "ERROR",
      metadata: {
        severity,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Add performance monitoring
  async trackPerformance(
    operation: string,
    duration: number,
    success: boolean
  ) {
    await langfuse.trace({
      name: "Performance",
      input: operation,
      output: success ? "Success" : "Failure",
      metadata: {
        duration,
        success,
        timestamp: new Date().toISOString()
      }
    });
  }
} 