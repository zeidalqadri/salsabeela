"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreVertical, Tag, Share2, Download, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { DocumentWithRelations } from "@/types/document";

interface DraggableDocumentListProps {
  documents: DocumentWithRelations[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, folderId: string | null) => Promise<boolean>;
  onTag: (id: string) => void;
  onShare: (id: string) => void;
  currentFolderId: string | null;
}

interface DocumentItemProps {
  document: DocumentWithRelations;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTag: (id: string) => void;
  onShare: (id: string) => void;
}

function DocumentItem({
  document,
  onView,
  onEdit,
  onDelete,
  onTag,
  onShare,
}: DocumentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: document.id,
    data: {
      type: "document",
      document,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card p-4 transition-colors hover:bg-accent",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3
          className="cursor-pointer font-medium hover:underline"
          onClick={() => onView(document.id)}
        >
          {document.name}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(document.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTag(document.id)}>
              <Tag className="mr-2 h-4 w-4" />
              Manage Tags
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(document.id)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(document.id)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          {document.content || "No content"}
        </p>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        {document.tags?.map((documentTag) => (
          <div
            key={documentTag.tag.id}
            className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            style={{ backgroundColor: documentTag.tag.color + "40" }}
          >
            {documentTag.tag.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DraggableDocumentList({
  documents,
  onView,
  onEdit,
  onDelete,
  onMove,
  onTag,
  onShare,
  currentFolderId,
}: DraggableDocumentListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <DocumentItem
          key={document.id}
          document={document}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onTag={onTag}
          onShare={onShare}
        />
      ))}
    </div>
  );
} 