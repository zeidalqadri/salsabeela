import { Mem0Service } from "@/modules/memory/mem0-service";

export async function POST(req: Request) {
  const { userId, query, options } = await req.json();
  const service = new Mem0Service();
  
  try {
    const results = await service.searchMemoryWithRelevance(
      userId, 
      query,
      options?.threshold
    );
    return Response.json(results);
  } catch (error) {
    return Response.json(
      { error: "Memory search failed" },
      { status: 500 }
    );
  }
} 