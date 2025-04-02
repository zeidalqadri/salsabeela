import { useMutation } from "@tanstack/react-query";
import { LangfuseService } from "@/modules/observability/langfuse-service";

export function MemorySearch() {
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(0.7);
  const langfuse = new LangfuseService();
  
  const mutation = useMutation({
    mutationFn: async (query: string) => {
      const start = Date.now();
      try {
        const response = await fetch("/api/memory", {
          method: "POST",
          body: JSON.stringify({ 
            userId: "current-user-id",
            query,
            options: { threshold }
          })
        });
        
        const duration = Date.now() - start;
        await langfuse.trackPerformance(
          "Memory Search",
          duration,
          true
        );
        
        return response.json();
      } catch (error) {
        const duration = Date.now() - start;
        await langfuse.trackPerformance(
          "Memory Search",
          duration,
          false
        );
        throw error;
      }
    }
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={mutation.isPending}
      />
      <button 
        onClick={() => mutation.mutate(query)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Searching..." : "Search"}
      </button>
      
      {mutation.isError && (
        <div className="error">Search failed: {mutation.error.message}</div>
      )}
      
      {mutation.isSuccess && (
        <div className="results">
          {mutation.data.map((result, i) => (
            <div key={i}>{result}</div>
          ))}
        </div>
      )}
    </div>
  );
} 