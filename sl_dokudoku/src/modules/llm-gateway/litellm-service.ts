export class LiteLLMService {
  // Add cost tracking
  private async trackCost(usage: any) {
    await prisma.llmUsage.create({
      data: {
        model: usage.model,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        cost: usage.cost
      }
    });
  }

  // Add retry logic
  async callWithRetry(prompt: string, retries = 3): Promise<any> {
    try {
      const response = await litellm.completion({
        model: "deepseek",
        messages: [{ role: "user", content: prompt }]
      });
      
      await this.trackCost(response.usage);
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.callWithRetry(prompt, retries - 1);
      }
      throw error;
    }
  }

  // Add rate limiting
  private rateLimiter = new RateLimiter({
    tokensPerInterval: 10,
    interval: "minute"
  });

  async callWithRateLimit(prompt: string): Promise<any> {
    await this.rateLimiter.removeTokens(1);
    return this.callWithRetry(prompt);
  }

  // Add streaming support
  async streamResponse(prompt: string, onData: (chunk: string) => void) {
    const response = await litellm.completion({
      model: "deepseek",
      messages: [{ role: "user", content: prompt }],
      stream: true
    });

    for await (const chunk of response) {
      onData(chunk.choices[0]?.delta?.content || "");
    }
  }
} 