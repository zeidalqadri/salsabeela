import { useQuery } from '@tanstack/react-query';
import { DocumentShare, User } from '@prisma/client'; // Import Prisma types

// Define the shape of the permission data returned by the API (includes user details)
export type PermissionWithUser = DocumentShare & {
  user: { id: string; name: string | null; email: string | null; image: string | null };
};

// Function to fetch permissions for a specific document
async function fetchPermissions(documentId: string): Promise<PermissionWithUser[]> {
  console.log(`Fetching permissions for document ${documentId}...`);
  // Use the GET /api/share endpoint with documentId query parameter
  const response = await fetch(`/api/share?documentId=${encodeURIComponent(documentId)}`); 

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to fetch permissions: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Custom hook to fetch permissions for a specific document.
 * @param documentId The ID of the document.
 * @param enabled Whether the query should be enabled (e.g., only when modal is open). Defaults to true.
 */
export function usePermissions(documentId: string, enabled: boolean = true) {
  return useQuery<PermissionWithUser[], Error>({
    // Query key includes the document ID to fetch permissions specific to it
    queryKey: ['permissions', documentId], 
    queryFn: () => fetchPermissions(documentId),
    enabled: !!documentId && enabled, // Only run query if documentId is provided and enabled is true
    // Consider adding staleTime if permissions don't change frequently
    // staleTime: 5 * 60 * 1000, 
  });
}
