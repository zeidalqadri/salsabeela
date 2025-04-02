"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface MoveDocumentParams {
  id: string;
  folderId: string | null;
}

export function useDocumentMutations() {
  const queryClient = useQueryClient();

  // Move document mutation
  const moveDocumentMutation = useMutation({
    mutationFn: async ({ id, folderId }: MoveDocumentParams) => {
      const response = await fetch(`/api/documents/${id}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to move document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to move document',
        variant: 'destructive',
      });
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    },
  });

  const moveDocument = (params: MoveDocumentParams) => {
    return moveDocumentMutation.mutateAsync(params);
  };

  const deleteDocument = (documentId: string) => {
    return deleteDocumentMutation.mutateAsync(documentId);
  };

  return {
    moveDocument,
    deleteDocument,
    isMoving: moveDocumentMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
  };
}