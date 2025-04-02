import { useQuery } from '@tanstack/react-query'

// Define the type for a search result item
// Consider moving to src/lib/types.ts later
export interface SearchResultItem { // Add export keyword
  id: string;
  title: string;
  type: 'document' | 'user' | 'folder' | 'tag'; // Example types
  createdAt?: string; // Optional depending on result type
  snippet?: string; // Optional snippet
}

// Define the structure of the search API response
interface SearchApiResponse {
  query: string;
  results: SearchResultItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Function to fetch search results from the API
async function fetchSearchResults(query: string, page: number = 1, limit: number = 10): Promise<SearchApiResponse> {
  if (!query) {
    // Return empty results if query is empty, matching API behavior
    return { query: '', results: [], pagination: { currentPage: 1, pageSize: limit, totalCount: 0, totalPages: 0 } };
  }
  
  console.log(`Fetching search results for "${query}", Page: ${page}, Limit: ${limit}...`);
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`); 
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Network response was not ok: ${response.statusText}`);
  }
  return response.json(); 
}

/**
 * Custom hook to fetch search results using React Query.
 * @param query The search term.
 * @param page The current page number (default: 1).
 * @param limit The number of results per page (default: 10).
 */
export function useSearch(query: string, page: number = 1, limit: number = 10) {
  return useQuery<SearchApiResponse, Error>({
    // Query key includes query, page, and limit to refetch when they change
    queryKey: ['search', query, page, limit], 
    // Only run the query if the query string is not empty
    queryFn: () => fetchSearchResults(query, page, limit), 
    enabled: !!query, // Disable query if 'query' is empty
    placeholderData: (previousData) => previousData, // Keep previous data while loading new results
    // Consider adding staleTime if search results don't need to be ultra-fresh
    // staleTime: 5 * 60 * 1000, 
  });
}
