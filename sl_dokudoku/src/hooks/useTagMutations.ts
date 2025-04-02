import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { type Tag } from '@prisma/client';

interface CreateTagData {
  name: string;
  color: string;
}

interface UpdateTagData {
  id: string;
  name?: string;
  color?: string;
}

export function useTagMutations() {
  const queryClient = useQueryClient();

  const useCreateTag = () => {
    return useMutation({
      mutationFn: async (data: CreateTagData) => {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create tag');
        }

        return response.json();
      },
      onSuccess: (newTag) => {
        queryClient.setQueryData<Tag[]>(['tags'], (old) => {
          return old ? [...old, newTag] : [newTag];
        });
        toast({ title: 'Success', description: 'Tag created successfully' });
      },
      onError: (error: Error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to create tag' });
      },
    });
  };

  const useUpdateTag = () => {
    return useMutation({
      mutationFn: async (data: UpdateTagData) => {
        const response = await fetch(`/api/tags/${data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            color: data.color,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update tag');
        }

        return response.json();
      },
      onSuccess: (updatedTag, variables) => {
        queryClient.setQueryData<Tag[]>(['tags'], (old) => {
          return old?.map((tag) =>
            tag.id === variables.id ? { ...tag, ...variables } : tag
          );
        });
        toast({ title: 'Success', description: 'Tag updated successfully' });
      },
      onError: (error: Error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update tag' });
      },
    });
  };

  const useDeleteTag = () => {
    return useMutation({
      mutationFn: async (tagId: string) => {
        const response = await fetch(`/api/tags/${tagId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete tag');
        }

        return response.json();
      },
      onSuccess: (_, tagId) => {
        queryClient.setQueryData<Tag[]>(['tags'], (old) => {
          return old?.filter((tag) => tag.id !== tagId);
        });
        // Also invalidate documents query as tags might be removed from documents
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        toast({ title: 'Success', description: 'Tag deleted successfully' });
      },
      onError: (error: Error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete tag' });
      },
    });
  };

  const useAddTagToDocument = () => {
    return useMutation({
      mutationFn: async ({ documentId, tagId }: { documentId: string; tagId: string }) => {
        const response = await fetch(`/api/documents/${documentId}/tags/${tagId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to add tag to document');
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        toast({ title: 'Success', description: 'Tag added to document' });
      },
      onError: (error: Error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to add tag to document' });
      },
    });
  };

  const useRemoveTagFromDocument = () => {
    return useMutation({
      mutationFn: async ({ documentId, tagId }: { documentId: string; tagId: string }) => {
        const response = await fetch(`/api/documents/${documentId}/tags/${tagId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to remove tag from document');
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        toast({ title: 'Success', description: 'Tag removed from document' });
      },
      onError: (error: Error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to remove tag from document' });
      },
    });
  };

  return {
    useCreateTag,
    useUpdateTag,
    useDeleteTag,
    useAddTagToDocument,
    useRemoveTagFromDocument,
  };
}
