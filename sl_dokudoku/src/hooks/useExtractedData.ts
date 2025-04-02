import { useQuery } from '@tanstack/react-query';
import { ExtractedDatum } from '@prisma/client';

// Type for the grouped data returned by the API
export type GroupedExtractedData = Record<string, ExtractedDatum[]>;

// Function to fetch extracted data for a specific document
async function fetchExtractedData(documentId: string): Promise<GroupedExtractedData> {
  console.log(`Fetching extracted data for document ${documentId}...`);
  const response = await fetch(`/api/documents/${documentId}/extracted-data`); 

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch extracted data: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Custom hook to fetch extracted data for a specific document.
 * @param documentId The ID of the document.
 * @param enabled Whether the query should be enabled. Defaults to true.
 */
export function useExtractedData(documentId: string, enabled: boolean = true) {
  return useQuery<GroupedExtractedData, Error>({
    queryKey: ['extractedData', documentId], 
    queryFn: () => fetchExtractedData(documentId),
    enabled: !!documentId && enabled, // Only run query if documentId is provided and enabled
    // Stale time might be longer as extracted data changes less often than document list
    staleTime: 15 * 60 * 1000, // 15 minutes 
  });
}
