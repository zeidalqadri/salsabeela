'use client';

import React, { useState } from 'react';
import { useFolders, type FolderWithCounts } from '@/hooks/useFolders';
import { useCreateFolder, useUpdateFolder, useDeleteFolder } from '@/hooks/useFolderMutations';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Folder as FolderIcon, Inbox, Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Recursive component to render folder structure
const FolderNode: React.FC<{
  folder: FolderWithCounts;
  allFolders: FolderWithCounts[];
  level: number;
  currentFolderId: string | null;
  router: ReturnType<typeof useRouter>;
  searchParams: ReturnType<typeof useSearchParams>;
  onRename: (folderId: string, name: string) => void;
  onDelete: (folderId: string) => void;
}> = ({ 
  folder, 
  allFolders, 
  level, 
  currentFolderId, 
  router, 
  searchParams,
  onRename,
  onDelete
}) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Find children of the current folder
  const children = allFolders.filter(f => f.parentId === folder.id);
  const isSelected = currentFolderId === folder.id;
  const hasDocuments = (folder._count?.documents || 0) > 0;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('folderId', folder.id);
    params.set('page', '1');
    router.push(`/documents?${params.toString()}`);
  };
  
  const handleRename = () => {
    if (newFolderName.trim() && newFolderName !== folder.name) {
      onRename(folder.id, newFolderName);
    }
    setIsRenameDialogOpen(false);
  };
  
  const handleDelete = () => {
    onDelete(folder.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            `flex items-center space-x-2 py-1 pl-${level * 4} cursor-pointer hover:bg-accent rounded flex-grow`,
            isSelected && "bg-accent text-accent-foreground"
          )}
          onClick={handleClick}
        >
          <FolderIcon className="w-4 h-4 text-muted-foreground" />
          <span>{folder.name}</span>
          <span className="text-xs text-muted-foreground">({folder._count?.documents ?? 0})</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={hasDocuments}
              className={hasDocuments ? "text-muted-foreground" : "text-destructive"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
              {hasDocuments && <span className="ml-2 text-xs">(Not Empty)</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for this folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {children.length > 0 && (
        <div className="ml-4">
          {children.map(child => (
            <FolderNode
              key={child.id}
              folder={child}
              allFolders={allFolders}
              level={level + 1}
              currentFolderId={currentFolderId}
              router={router}
              searchParams={searchParams}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FolderTree() {
  const { folderTree, isLoading, isError, error } = useFolders();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get('folderId');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();

  const handleSelectAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('folderId');
    params.set('page', '1');
    router.push(`/documents?${params.toString()}`);
  };
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    createFolderMutation.mutate(
      { name: newFolderName.trim(), parentId: null },
      {
        onSuccess: () => {
          setNewFolderName('');
          setIsCreateDialogOpen(false);
        }
      }
    );
  };
  
  const handleRenameFolder = (folderId: string, name: string) => {
    updateFolderMutation.mutate({
      id: folderId,
      name
    });
  };
  
  const handleDeleteFolder = (folderId: string) => {
    deleteFolderMutation.mutate(folderId);
  };

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2 ml-4" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-2 text-destructive text-sm flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4" />
        <span>Error loading folders: {error?.message}</span>
      </div>
    );
  }

  if (!folderTree || folderTree.length === 0) {
    return (
      <div className="p-2 space-y-2">
        <div className="text-muted-foreground text-sm italic">No folders created yet.</div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Folder
        </Button>
        
        {/* Create Folder Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newFolderName" className="text-right">
                  Name
                </Label>
                <Input
                  id="newFolderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || createFolderMutation.isPending}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Filter root folders (those without a parentId)
  const rootFolders = folderTree.filter((folder: FolderWithCounts) => !folder.parentId);

  return (
    <div className="space-y-1 p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Folders</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create Folder</span>
        </Button>
      </div>
      
      {/* "All Documents" option */}
      <div
        className={cn(
          "flex items-center space-x-2 py-1 cursor-pointer hover:bg-accent rounded",
          currentFolderId === null && "bg-accent text-accent-foreground"
        )}
        onClick={handleSelectAll}
      >
        <Inbox className="w-4 h-4 text-muted-foreground" />
        <span>All Documents</span>
      </div>

      {rootFolders.map((folder: FolderWithCounts) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          allFolders={folderTree}
          level={0}
          currentFolderId={currentFolderId}
          router={router}
          searchParams={searchParams}
          onRename={handleRenameFolder}
          onDelete={handleDeleteFolder}
        />
      ))}
      
      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newFolderName" className="text-right">
                Name
              </Label>
              <Input
                id="newFolderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || createFolderMutation.isPending}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
