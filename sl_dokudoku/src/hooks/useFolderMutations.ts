import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { Folder } from '@prisma/client'; // Import generated Folder type
import { FolderWithCounts } from './useFolders'

// --- Create Folder ---
interface CreateFolderData {
  name: string;
  parentId?: string | null;
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateFolderData) => {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create folder');
      }

      return response.json();
    },
    onSuccess: (newFolder) => {
      queryClient.setQueryData<FolderWithCounts[]>(['folders'], (old) => {
        return old ? [...old, { ...newFolder, _count: { documents: 0 } }] : [newFolder];
      });
      toast({ title: 'Success', description: `Folder "${newFolder.name}" created.` });
      // Invalidate queries for the parent folder list and potentially root list
      queryClient.invalidateQueries({ queryKey: ['folders', newFolder.parentId || null] });
      if (newFolder.parentId) {
         queryClient.invalidateQueries({ queryKey: ['folders', null] }); // Invalidate root if nested
      }
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to create folder' });
    },
  });
}

// --- Update Folder ---
interface UpdateFolderData {
  id: string;
  name: string;
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateFolderData) => {
      const response = await fetch(`/api/folders/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update folder');
      }

      return response.json();
    },
    onSuccess: (updatedFolder, variables) => {
      queryClient.setQueryData<FolderWithCounts[]>(['folders'], (old) => {
        return old?.map((folder) =>
          folder.id === variables.id ? { ...folder, name: variables.name } : folder
        );
      });
      toast({ title: 'Success', description: `Folder "${updatedFolder.name}" updated.` });
      // Invalidate folder list for the current parent and potentially the old parent if moved
      queryClient.invalidateQueries({ queryKey: ['folders'] }); // Invalidate all folder queries for simplicity for now
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update folder' });
    },
  });
}

// --- Delete Folder ---
export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete folder');
      }

      return response.json();
    },
    onSuccess: (_, folderId) => {
      queryClient.setQueryData<FolderWithCounts[]>(['folders'], (old) => {
        return old?.filter((folder) => folder.id !== folderId);
      });
      toast({ title: 'Success', description: 'Folder deleted successfully.' });
      // Invalidate all folder queries as deletion might affect multiple views
      queryClient.invalidateQueries({ queryKey: ['folders'] }); 
      // Also invalidate documents query as documents might become orphaned (parentId=null)
      queryClient.invalidateQueries({ queryKey: ['documents'] }); 
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete folder' });
    },
  });
}
