"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DraggableFolderTree } from "@/components/folders/draggable-folder-tree";
import { DraggableDocumentList } from "@/components/documents/draggable-document-list";
import { DndProvider } from "@/components/dnd/dnd-provider";
import { useDocuments } from "@/hooks/use-documents";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

interface DocumentsManagerProps {
  showDocuments?: boolean;
}

export function DocumentsManager({ showDocuments = true }: DocumentsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folder");
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folderId);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [draggedDocument, setDraggedDocument] = useState<string | null>(null);
  
  const { documents, isLoading: isLoadingDocuments, deleteDocument, moveDocument } = useDocuments({
    filters: {
      folderId: selectedFolderId,
      search: searchTerm,
    }
  });

  const { toast } = useToast();
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    
    // Update the URL to reflect the selected folder
    const params = new URLSearchParams(searchParams.toString());
    if (folderId) {
      params.set("folder", folderId);
    } else {
      params.delete("folder");
    }
    
    router.push(`/documents?${params.toString()}`);
  };
  
  // Handle document actions
  const handleViewDocument = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  
  const handleEditDocument = (documentId: string) => {
    router.push(`/documents/${documentId}/edit`);
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      
      toast({
        title: "Document deleted",
        description: "The document has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive",
      });
    }
    
    setDocumentToDelete(null);
  };
  
  const handleMoveDocument = async (documentId: string, targetFolderId: string | null) => {
    try {
      await moveDocument({ id: documentId, folderId: targetFolderId });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move the document. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const handleTagDocument = (documentId: string) => {
    router.push(`/documents/${documentId}/tags`);
  };
  
  const handleShareDocument = (documentId: string) => {
    router.push(`/documents/${documentId}/share`);
  };
  
  const handleUploadDocument = () => {
    router.push(`/documents/upload${selectedFolderId ? `?folder=${selectedFolderId}` : ''}`);
  };

  // Handle drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "document") {
      setDraggedDocument(active.data.current.id);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedDocument(null);

    if (!active || !over) return;

    // Handle dropping a document onto a folder
    if (
      active.data.current?.type === "document" &&
      over.data.current?.type === "folder"
    ) {
      const documentId = active.data.current.id;
      const targetFolderId = over.data.current.id;

      // Don't move if dropping into the current folder
      if (targetFolderId === selectedFolderId) return;

      await handleMoveDocument(documentId, targetFolderId);
    }
  };
  
  // Render based on the view type
  if (!showDocuments) {
    return (
      <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DraggableFolderTree 
          selectedFolderId={selectedFolderId}
          onSelect={handleFolderSelect}
        />
      </DndProvider>
    );
  }
  
  return (
    <DndProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedFolderId ? `Documents in ${selectedFolderId}` : "All Documents"}
          </h2>
          <Button onClick={handleUploadDocument}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        
        <div className="mb-4">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {isLoadingDocuments ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DraggableDocumentList 
            documents={documents || []}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDelete={(id) => setDocumentToDelete(id)}
            onMove={handleMoveDocument}
            onTag={handleTagDocument}
            onShare={handleShareDocument}
            currentFolderId={selectedFolderId}
          />
        )}
        
        <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this document? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DndProvider>
  );
} 