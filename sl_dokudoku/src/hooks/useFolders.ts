"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder } from '@prisma/client'; // Assuming Folder type is available
import { toast } from "@/components/ui/use-toast";

// Define the structure expected from the API, including counts
export interface FolderWithCounts extends Folder {
  _count: {
    documents: number;
    children: number;
  };
  documentCount: number; // For UI convenience
  children: FolderWithCounts[]; // Nested folders
}

// Function to fetch folders from the API
// Currently fetches all folders for the user
async function fetchFolders(): Promise<FolderWithCounts[]> {
  console.log('Fetching folders...');
  const response = await fetch('/api/folders', {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to fetch folders: ${response.statusText}`);
  }
  
  const folders: FolderWithCounts[] = await response.json();
  
  // Convert from flat array to hierarchical structure
  const folderMap = new Map<string, FolderWithCounts>();
  const folderTree: FolderWithCounts[] = [];
  
  // First pass: Map all folders by ID and transform _count to documentCount
  folders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      documentCount: folder._count.documents,
      children: [],
    });
  });
  
  // Second pass: Build the tree structure
  folders.forEach(folder => {
    const processedFolder = folderMap.get(folder.id)!;
    
    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(processedFolder);
      } else {
        // If parent not found, treat as root
        folderTree.push(processedFolder);
      }
    } else {
      // No parent means it's a root folder
      folderTree.push(processedFolder);
    }
  });
  
  return folderTree;
}

// Create a new folder
async function createFolder(data: { name: string; parentId?: string }): Promise<Folder> {
  const response = await fetch('/api/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to create folder: ${response.statusText}`);
  }

  return response.json();
}

// Update a folder's name
async function updateFolder(data: { id: string; data: { name: string } }): Promise<Folder> {
  const response = await fetch(`/api/folders/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data.data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to update folder: ${response.statusText}`);
  }

  return response.json();
}

// Update a folder's parent (move folder)
async function updateFolderParent(data: { id: string; parentId: string | null }): Promise<Folder> {
  const response = await fetch(`/api/folders/${data.id}/move`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ parentId: data.parentId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to move folder: ${response.statusText}`);
  }

  return response.json();
}

// Delete a folder
async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`/api/folders/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to delete folder: ${response.statusText}`);
  }
}

interface CreateFolderParams {
  name: string;
  parentId?: string | null;
}

interface UpdateFolderParams {
  id: string;
  name: string;
  parentId?: string | null;
}

async function getFolders(): Promise<Folder[]> {
  const response = await fetch("/api/folders", {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Failed to fetch folders");
  }
  return response.json();
}

/**
 * Custom hook to manage folders for the authenticated user.
 */
export function useFolders() {
  const queryClient = useQueryClient();
  
  // Query to fetch all folders
  const { data: folderTree = [], isLoading, isError, error } = useQuery<FolderWithCounts[], Error>({
    queryKey: ['folders'],
    queryFn: fetchFolders,
    staleTime: 30 * 1000, // 30 seconds
  });

  const createFolderMutation = useMutation({
    mutationFn: async (params: CreateFolderParams) => {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create folder");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder created",
        description: "The folder has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async (params: UpdateFolderParams) => {
      const response = await fetch(`/api/folders/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          name: params.name,
          parentId: params.parentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update folder");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder updated",
        description: "The folder has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update folder",
        variant: "destructive",
      });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete folder");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({
        title: "Folder deleted",
        description: "The folder has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete folder",
        variant: "destructive",
      });
    },
  });

  const createFolder = (params: CreateFolderParams) => {
    return createFolderMutation.mutateAsync(params);
  };

  const updateFolder = (params: UpdateFolderParams) => {
    return updateFolderMutation.mutateAsync(params);
  };

  const deleteFolder = (folderId: string) => {
    return deleteFolderMutation.mutateAsync(folderId);
  };

  return {
    folderTree,
    isLoading,
    isError,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    isCreating: createFolderMutation.isPending,
    isUpdating: updateFolderMutation.isPending,
    isDeleting: deleteFolderMutation.isPending,
  };
}
