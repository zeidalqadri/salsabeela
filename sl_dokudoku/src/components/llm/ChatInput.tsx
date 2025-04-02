import { useMutation } from "@tanstack/react-query";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await fetch("/api/llm", {
        method: "POST",
        body: JSON.stringify({ prompt })
      });
      return response.json();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={mutation.isPending}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending..." : "Send"}
      </button>
      {mutation.isError && (
        <div className="error">Error: {mutation.error.message}</div>
      )}
    </form>
  );
} 