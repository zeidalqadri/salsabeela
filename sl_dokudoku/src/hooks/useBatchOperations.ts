import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface BatchOperationResponse {
  success: boolean;
  message: string;
}

async function batchDelete(documentIds: string[]): Promise<BatchOperationResponse> {
  const response = await fetch('/api/documents/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete documents');
  }

  return response.json();
}

async function batchMove(documentIds: string[], folderId: string | null): Promise<BatchOperationResponse> {
  const response = await fetch('/api/documents/batch/move', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentIds, folderId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to move documents');
  }

  return response.json();
}

async function batchTag(documentIds: string[], tagIds: string[]): Promise<BatchOperationResponse> {
  const response = await fetch('/api/documents/batch/tag', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentIds, tagIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to tag documents');
  }

  return response.json();
}

export function useBatchDeleteDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documents deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useBatchMoveDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentIds, folderId }: { documentIds: string[]; folderId: string | null }) =>
      batchMove(documentIds, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documents moved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useBatchTagDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentIds, tagIds }: { documentIds: string[]; tagIds: string[] }) =>
      batchTag(documentIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Documents tagged successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
} 