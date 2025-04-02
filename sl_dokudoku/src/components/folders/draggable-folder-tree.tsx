"use client";

import { useState, useCallback } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder as FolderIcon, 
  Plus, 
  MoreVertical,
  Check,
  Trash2,
  FolderOpen,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Folder } from "@prisma/client";
import { useFolders } from "@/hooks/use-folders";
import type { FolderWithCounts } from "@/hooks/use-folders";
import { 
  DndProvider, 
  DroppableArea,
  DraggableItem,
  DragOverlay,
  SortableContext, 
  verticalListSortingStrategy 
} from "@/components/dnd";
import { 
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableFolderNodeProps {
  folder: FolderWithCounts;
  level: number;
  selectedFolderId?: string | null;
  onSelect: (folderId: string | null) => void;
  expandedFolders: Set<string>;
  toggleExpand: (folderId: string) => void;
  onEdit: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

function DraggableFolderNode({ 
  folder, 
  level, 
  selectedFolderId, 
  onSelect,
  expandedFolders,
  toggleExpand,
  onEdit,
  onDelete
}: DraggableFolderNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const { updateFolder, deleteFolder } = useFolders();
  const isExpanded = expandedFolders.has(folder.id);
  const { setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: "folder",
      id: folder.id,
      accepts: ["document", "folder"],
    },
  });

  const handleUpdate = () => {
    updateFolder({
      id: folder.id,
      name: newName
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (folder.documentCount === 0 && folder.children.length === 0) {
      deleteFolder(folder.id);
      toast({
        title: "Folder deleted",
        description: `${folder.name} has been deleted.`
      });
    } else {
      toast({
        title: "Cannot delete folder",
        description: "This folder contains documents or subfolders.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <DraggableItem 
        id={`folder-${folder.id}`} 
        data={{ 
          type: "folder", 
          id: folder.id,
          parentId: folder.parentId,
          name: folder.name
        }}
        className="relative"
      >
        <div
          ref={setNodeRef}
          className={cn(
            "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent",
            selectedFolderId === folder.id && "bg-accent"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 shrink-0 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(folder.id);
            }}
          >
            {folder.children.length > 0 && (
              isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          
          <FolderIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          
          {isEditing ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="h-6 py-1 px-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="flex-1 text-sm truncate"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(folder.id);
              }}
            >
              {folder.name}
              {folder.documentCount > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({folder.documentCount})
                </span>
              )}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(folder.id)}
                disabled={folder.documentCount > 0 || folder.children.length > 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DraggableItem>

      {isExpanded && folder.children.length > 0 && (
        <DroppableArea 
          id={`folder-drop-${folder.id}`}
          data={{ 
            type: "folder-children", 
            parentId: folder.id 
          }}
        >
          <div>
            {folder.children.map((child: FolderWithCounts) => (
              <DraggableFolderNode
                key={child.id}
                folder={child}
                level={level + 1}
                selectedFolderId={selectedFolderId}
                onSelect={onSelect}
                expandedFolders={expandedFolders}
                toggleExpand={toggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </DroppableArea>
      )}
    </div>
  );
}

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
}

function CreateFolderDialog({ open, onOpenChange, parentId }: CreateFolderDialogProps) {
  const [name, setName] = useState("");
  const { createFolder } = useFolders();

  const handleCreate = () => {
    createFolder({ name, parentId });
    setName("");
    onOpenChange(false);
    toast({
      title: "Folder created",
      description: `${name} has been created.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FolderTreeProps {
  selectedFolderId?: string | null;
  onSelect: (folderId: string | null) => void;
}

export function DraggableFolderTree({ selectedFolderId, onSelect }: FolderTreeProps) {
  const { folderTree, isLoading, updateFolder, createFolder, deleteFolder, moveFolder } = useFolders();
  const [isCreating, setIsCreating] = useState(false);
  const [createInFolderId, setCreateInFolderId] = useState<string>();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeFolder, setActiveFolder] = useState<any>(null);
  const [confirmMove, setConfirmMove] = useState<{
    sourceId: string;
    destinationId: string;
    sourceName: string;
    destinationName: string;
  } | null>(null);
  const router = useRouter();

  const toggleExpand = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'folder') {
      setActiveFolder(active.data.current);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // Only handle folder drag events
    if (!active || !over || active.data.current?.type !== 'folder') {
      return;
    }

    // Don't allow dropping on itself
    if (active.id === over.id) {
      return;
    }

    // Handle dropping into a folder drop area
    if (over.data.current?.type === 'folder-children') {
      // Prevent moving a parent folder into its own child
      const destinationId = over.data.current.parentId;
      const sourceId = active.data.current.id;
      
      // Automatically expand the folder when dragging over it
      if (!expandedFolders.has(destinationId)) {
        setExpandedFolders(prev => new Set([...prev, destinationId]));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveFolder(null);
    
    if (!active || !over) return;

    // Only handle folder drag events
    if (active.data.current?.type !== 'folder') {
      return;
    }

    // Handle dropping into a folder drop area
    if (over.data.current?.type === 'folder-children') {
      const sourceId = active.data.current.id;
      const destinationId = over.data.current.parentId;
      
      // Don't move to same parent or to itself
      if (active.data.current.parentId === destinationId || sourceId === destinationId) {
        return;
      }
      
      // Ask for confirmation before moving
      setConfirmMove({
        sourceId,
        destinationId,
        sourceName: active.data.current.name,
        destinationName: folderTree.find(f => f.id === destinationId)?.name || 'root',
      });
    }
  };

  const confirmFolderMove = () => {
    if (!confirmMove) return;
    
    moveFolder({
      id: confirmMove.sourceId,
      parentId: confirmMove.destinationId
    });
    
    toast({
      title: "Folder moved",
      description: `${confirmMove.sourceName} has been moved to ${confirmMove.destinationName}.`
    });
    
    setConfirmMove(null);
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    try {
      await createFolder({
        name,
        parentId: selectedFolderId,
      });
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleEditFolder = async (folderId: string) => {
    const folder = folderTree.find((f: FolderWithCounts) => f.id === folderId);
    if (!folder) return;

    const name = prompt("Enter new folder name:", folder.name);
    if (!name || name === folder.name) return;

    try {
      await updateFolder({
        id: folderId,
        name
      });
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const folder = folderTree.find((f: FolderWithCounts) => f.id === folderId);
    if (!folder) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${folder.name}"? This will also delete all subfolders.`
    );
    if (!confirmed) return;

    try {
      await deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        onSelect(null);
      }
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  // All folder IDs for SortableContext
  const folderIds = folderTree.map((folder: FolderWithCounts) => `folder-${folder.id}`);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setCreateInFolderId(undefined);
            setIsCreating(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <DndProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={folderIds} strategy={verticalListSortingStrategy}>
          <DroppableArea 
            id="root-folder-drop" 
            data={{ type: "folder-children", parentId: null }}
            className="space-y-1"
          >
            {folderTree.map((folder: FolderWithCounts) => (
              <DraggableFolderNode
                key={folder.id}
                folder={folder}
                level={0}
                selectedFolderId={selectedFolderId}
                onSelect={onSelect}
                expandedFolders={expandedFolders}
                toggleExpand={toggleExpand}
                onEdit={handleEditFolder}
                onDelete={handleDeleteFolder}
              />
            ))}
          </DroppableArea>
        </SortableContext>

        <DragOverlay>
          {activeFolder && (
            <div className="flex items-center gap-1 py-1 px-2 bg-background border rounded-md shadow-md">
              <FolderIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{activeFolder.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndProvider>

      <CreateFolderDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        parentId={createInFolderId}
      />

      {confirmMove && (
        <Dialog open={!!confirmMove} onOpenChange={() => setConfirmMove(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move Folder</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to move <strong>{confirmMove.sourceName}</strong> to <strong>{confirmMove.destinationName}</strong>?
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setConfirmMove(null)}>
                Cancel
              </Button>
              <Button onClick={confirmFolderMove}>
                <Check className="mr-2 h-4 w-4" />
                Confirm Move
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 