import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import type { Folder } from "@prisma/client";

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
async function fetchFolders(): Promise<FolderWithCounts[]> {
  console.log('Fetching folders...');
  const response = await fetch('/api/folders');

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

interface CreateFolderParams {
  name: string;
  parentId?: string | null;
}

interface UpdateFolderParams {
  id: string;
  name: string;
}

interface MoveFolderParams {
  id: string;
  parentId: string | null;
}

async function createFolder(params: CreateFolderParams): Promise<FolderWithCounts> {
  const response = await fetch("/api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create folder");
  }

  return response.json();
}

async function updateFolder(params: UpdateFolderParams): Promise<FolderWithCounts> {
  const response = await fetch(`/api/folders/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: params.name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update folder");
  }

  return response.json();
}

async function moveFolder(params: MoveFolderParams): Promise<FolderWithCounts> {
  const response = await fetch(`/api/folders/${params.id}/move`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parentId: params.parentId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to move folder");
  }

  return response.json();
}

async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`/api/folders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete folder");
  }
}

export function useFolders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: folderTree = [],
    isLoading,
    isError,
    error,
  } = useQuery<FolderWithCounts[], Error>({
    queryKey: ['folders'],
    queryFn: fetchFolders,
  });
  
  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    },
  });
  
  const updateFolderMutation = useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update folder",
        variant: "destructive",
      });
    },
  });
  
  const moveFolderMutation = useMutation({
    mutationFn: moveFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to move folder",
        variant: "destructive",
      });
    },
  });
  
  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete folder",
        variant: "destructive",
      });
    },
  });
  
  return {
    folderTree,
    isLoading,
    isError,
    error,
    createFolder: createFolderMutation.mutateAsync,
    updateFolder: updateFolderMutation.mutateAsync,
    moveFolder: moveFolderMutation.mutateAsync,
    deleteFolder: deleteFolderMutation.mutateAsync,
    isCreating: createFolderMutation.isPending,
    isUpdating: updateFolderMutation.isPending,
    isMoving: moveFolderMutation.isPending,
    isDeleting: deleteFolderMutation.isPending,
  };
} 