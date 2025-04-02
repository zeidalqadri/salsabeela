import { LangfuseService } from "@/modules/observability/langfuse-service";

export async function POST(req: Request) {
  const { type, data } = await req.json();
  const service = new LangfuseService();
  
  try {
    switch (type) {
      case "trace":
        await service.traceLLMCallWithMetadata(
          data.prompt,
          data.response,
          data.metadata
        );
        break;
      case "error":
        await service.trackErrorWithContext(
          data.error,
          data.context,
          data.severity
        );
        break;
      case "performance":
        await service.trackPerformance(
          data.operation,
          data.duration,
          data.success
        );
        break;
      default:
        throw new Error("Invalid observability type");
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Observability tracking failed" },
      { status: 500 }
    );
  }
} 