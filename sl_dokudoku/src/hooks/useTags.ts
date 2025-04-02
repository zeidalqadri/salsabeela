import { useQuery } from '@tanstack/react-query';
import { Tag } from '@prisma/client'; // Assuming Tag type is available

// Define the structure expected from the API, including counts
export interface TagWithCounts extends Tag {
  _count: {
    documents: number;
  };
}

// Function to fetch tags from the API
async function fetchTags(): Promise<TagWithCounts[]> {
  console.log('Fetching tags...');
  const response = await fetch('/api/tags'); // Uses the GET route

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to fetch tags: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Custom hook to fetch all tags for the authenticated user.
 */
export function useTags() {
  return useQuery<TagWithCounts[], Error>({
    queryKey: ['tags'], // Query key for all tags
    queryFn: fetchTags,
    // Add staleTime if tag list doesn't need to be constantly refreshed
    // staleTime: 10 * 60 * 1000, 
  });
}
