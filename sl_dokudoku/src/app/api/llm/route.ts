import { LiteLLMService } from "@/modules/llm-gateway/litellm-service";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const service = new LiteLLMService();
  
  try {
    const response = await service.callWithRateLimit(prompt);
    return Response.json(response);
  } catch (error) {
    return Response.json(
      { error: "LLM request failed" },
      { status: 500 }
    );
  }
} 