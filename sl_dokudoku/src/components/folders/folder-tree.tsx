import { useState } from "react"
import { ChevronRight, ChevronDown, Folder as FolderIcon, Plus, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Folder } from "@prisma/client"
import { useFolders, type FolderWithCounts } from "@/hooks/useFolders"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FolderNodeProps {
  folder: FolderWithCounts
  level: number
  selectedFolderId?: string | null
  onSelect: (folderId: string | null) => void
}

function FolderNode({ folder, level, selectedFolderId, onSelect }: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(folder.name)
  const { updateFolder, deleteFolder } = useFolders()

  const handleUpdate = () => {
    updateFolder({
      id: folder.id,
      data: { name: newName }
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (folder.children.length === 0) {
      deleteFolder(folder.id)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-md cursor-pointer group",
          selectedFolderId === folder.id && "bg-accent",
        )}
        style={{ paddingLeft: `${level * 12 + 4}px` }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={() => setIsExpanded(!isExpanded)}
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
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onClick={() => onSelect(folder.id)}
          >
            {folder.name}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              Rename
            </DropdownMenuItem>
            {folder.children.length === 0 && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && folder.children.map((child) => (
        <FolderNode
          key={child.id}
          folder={child}
          level={level + 1}
          selectedFolderId={selectedFolderId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: string
}

function CreateFolderDialog({ open, onOpenChange, parentId }: CreateFolderDialogProps) {
  const [name, setName] = useState("")
  const { createFolder } = useFolders()

  const handleCreate = () => {
    createFolder({ name, parentId })
    setName("")
    onOpenChange(false)
  }

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
  )
}

interface FolderTreeProps {
  selectedFolderId?: string | null
  onSelect: (folderId: string | null) => void
}

export function FolderTree({ selectedFolderId, onSelect }: FolderTreeProps) {
  const { folderTree, isLoading } = useFolders()
  const [isCreating, setIsCreating] = useState(false)
  const [createInFolderId, setCreateInFolderId] = useState<string>()

  if (isLoading) {
    return <div>Loading folders...</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setCreateInFolderId(undefined)
            setIsCreating(true)
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {folderTree.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            selectedFolderId={selectedFolderId}
            onSelect={onSelect}
          />
        ))}
      </div>

      <CreateFolderDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        parentId={createInFolderId}
      />
    </div>
  )
} 