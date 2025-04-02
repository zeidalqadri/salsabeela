import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import type { Document } from "@prisma/client";
import type { DocumentWithRelations, DocumentsResponse } from "@/types/document";

interface DocumentFilters {
  folderId?: string | null;
  search?: string;
  tagIds?: string[];
  startDate?: Date;
  endDate?: Date;
  shared?: boolean;
}

async function getDocuments(filters: DocumentFilters = {}) {
  const params = new URLSearchParams();
  
  if (filters.folderId) {
    params.set("folderId", filters.folderId);
  }
  
  if (filters.search) {
    params.set("search", filters.search);
  }
  
  if (filters.tagIds?.length) {
    filters.tagIds.forEach(id => params.append("tagIds", id));
  }
  
  if (filters.startDate) {
    params.set("startDate", filters.startDate.toISOString());
  }
  
  if (filters.endDate) {
    params.set("endDate", filters.endDate.toISOString());
  }
  
  if (filters.shared) {
    params.set("shared", "true");
  }
  
  const response = await fetch(`/api/documents?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json() as Promise<DocumentsResponse>;
}

async function deleteDocument(id: string) {
  const response = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
}

async function moveDocument(id: string, folderId: string | null) {
  const response = await fetch(`/api/documents/${id}/move`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderId }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to move document");
  }
  
  return response.json() as Promise<DocumentWithRelations>;
}

interface UseDocumentsOptions {
  filters?: DocumentFilters;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["documents", options.filters],
    queryFn: () => getDocuments(options.filters),
  });
  
  const { mutateAsync: deleteDocumentMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });
  
  const { mutateAsync: moveDocumentMutation, isPending: isMoving } = useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) =>
      moveDocument(id, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to move document",
        variant: "destructive",
      });
    },
  });
  
  return {
    documents: data?.documents,
    total: data?.total,
    pageSize: data?.pageSize,
    page: data?.page,
    isLoading,
    isError,
    error,
    deleteDocument: deleteDocumentMutation,
    moveDocument: moveDocumentMutation,
    isDeleting,
    isMoving,
  };
}