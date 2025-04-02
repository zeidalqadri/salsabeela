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
import { useTags } from '@/hooks/useTags';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Tag } from '@prisma/client';

interface BatchTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocumentIds: string[];
}

export function BatchTagModal({ isOpen, onClose, selectedDocumentIds }: BatchTagModalProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const { data: tags, isLoading } = useTags();
  const queryClient = useQueryClient();

  const batchTagMutation = useMutation({
    mutationFn: async () => {
      if (selectedTagIds.size === 0) return;

      const response = await fetch('/api/documents/batch/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentIds: selectedDocumentIds,
          tagIds: Array.from(selectedTagIds),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add tags to documents');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({ title: 'Success', description: 'Tags added to documents successfully' });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add tags to documents',
      });
    },
  });

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = new Set(selectedTagIds);
    if (newSelectedTags.has(tagId)) {
      newSelectedTags.delete(tagId);
    } else {
      newSelectedTags.add(tagId);
    }
    setSelectedTagIds(newSelectedTags);
  };

  const handleApplyTags = () => {
    if (selectedTagIds.size === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one tag',
      });
      return;
    }

    batchTagMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tags to Documents</DialogTitle>
          <DialogDescription>
            Select tags to add to the selected documents.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div>Loading tags...</div>
            ) : (
              tags?.map((tag: Tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.id}
                    checked={selectedTagIds.has(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <Label
                    htmlFor={tag.id}
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApplyTags}
            disabled={selectedTagIds.size === 0 || batchTagMutation.isPending}
          >
            {batchTagMutation.isPending ? 'Applying...' : 'Apply Tags'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 