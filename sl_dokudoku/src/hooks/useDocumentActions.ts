import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import type { Document } from '@prisma/client';

interface DocumentActionsResponse {
  success: boolean;
  message: string;
}

async function deleteDocument(id: string): Promise<DocumentActionsResponse> {
  const response = await fetch(`/api/documents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete document');
  }

  return response.json();
}

async function updateDocument(id: string, data: Partial<Document>): Promise<Document> {
  const response = await fetch(`/api/documents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update document');
  }

  return response.json();
}

async function downloadDocument(id: string): Promise<Blob> {
  const response = await fetch(`/api/documents/${id}/download`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to download document');
  }

  return response.blob();
}

export function useDocumentActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
      updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleUpdate = async (id: string, data: Partial<Document>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      setIsDownloading(true);
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Success',
        description: 'Document downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to download document',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/documents/${id}`);
  };

  return {
    handleDelete,
    handleUpdate,
    handleDownload,
    handleEdit,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDownloading,
  };
} 