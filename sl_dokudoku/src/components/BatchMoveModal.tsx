'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFolders, type FolderWithCounts } from '@/hooks/useFolders';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BatchMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocumentIds: string[];
}

export function BatchMoveModal({ isOpen, onClose, selectedDocumentIds }: BatchMoveModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { folderTree: folders, isLoading } = useFolders();
  const queryClient = useQueryClient();

  const batchMoveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFolderId) return;

      const response = await fetch('/api/documents/batch/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentIds: selectedDocumentIds,
          folderId: selectedFolderId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to move documents');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast({ title: 'Success', description: 'Documents moved successfully' });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to move documents',
      });
    },
  });

  const handleMove = () => {
    if (!selectedFolderId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a destination folder',
      });
      return;
    }

    batchMoveMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Documents</DialogTitle>
          <DialogDescription>
            Select a destination folder for the selected documents.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Select
              value={selectedFolderId || ''}
              onValueChange={(value: string) => setSelectedFolderId(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination folder" />
              </SelectTrigger>
              <SelectContent>
                {folders?.map((folder: FolderWithCounts) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={!selectedFolderId || batchMoveMutation.isPending}
          >
            {batchMoveMutation.isPending ? 'Moving...' : 'Move'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 