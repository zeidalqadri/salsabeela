import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast' // Assuming toast exists
import { Document } from '@prisma/client'; // Import generated Document type
import { DocumentWithRelations } from "@/types/document"

// Define the type for the variables passed to the mutation function
interface UpdateDocumentVariables {
  documentId: string;
  data: {
    title: string;
    folderId?: string | null; // Allow updating folderId
    // Add other updatable fields like tags later
  };
}

// Function to call the PATCH API endpoint
async function updateDocument({ documentId, data }: UpdateDocumentVariables): Promise<DocumentWithRelations> { // Use UpdateDocumentVariables and add return type
  const response = await fetch(`/api/documents/${documentId}`, { // Use documentId from variables
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update document")
  }

  return response.json()
}

/**
 * Custom hook to update a document using React Query's useMutation.
 * Handles invalidating relevant queries on success.
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: (updatedDoc: DocumentWithRelations) => {
      // Update the document in the cache
      queryClient.setQueryData(
        ["document", updatedDoc.id],
        updatedDoc
      )
      // Invalidate the documents list to refetch
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  });
}
