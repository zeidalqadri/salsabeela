'use client';

import React, { useState } from 'react';
import { Tag } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTagMutations } from '@/hooks/useTagMutations';
import { useTags } from '@/hooks/useTags';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';

interface TagManagerProps {
  documentId: string;
  initialTags: Tag[]; // Tags currently associated with the document
}

export function TagManager({ documentId, initialTags = [] }: TagManagerProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newTagName, setNewTagName] = useState('');
  
  const { data: allTags = [] } = useTags();
  const { useAddTagToDocument, useRemoveTagFromDocument, useCreateTag } = useTagMutations();
  
  const addTagMutation = useAddTagToDocument();
  const removeTagMutation = useRemoveTagFromDocument();
  const createTagMutation = useCreateTag();

  // Filter available tags that aren't already assigned
  const availableTags = allTags.filter(
    tag => !initialTags.some(docTag => docTag.id === tag.id)
  );

  const handleAddExistingTag = (tagId: string) => {
    addTagMutation.mutate({ documentId, tagId });
  };

  const handleRemoveTag = (tagId: string) => {
    removeTagMutation.mutate({ documentId, tagId });
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    createTagMutation.mutate(
      { name: newTagName.trim() },
      {
        onSuccess: (newTag) => {
          // After creating, add it to the document
          addTagMutation.mutate({ documentId, tagId: newTag.id });
          setNewTagName('');
        }
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-md font-semibold">Tags</h4>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {initialTags.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground italic">No tags assigned.</p>
        )}
        {initialTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            <span>{tag.name}</span>
            {isEditing && (
              <button 
                className="ml-1 rounded-full hover:bg-destructive/80 p-0.5"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove tag {tag.name}</span>
              </button>
            )}
          </Badge>
        ))}
        {isEditing && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-auto py-0.5 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Add existing tag</div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {availableTags.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No available tags</p>
                    ) : (
                      availableTags.map(tag => (
                        <Button 
                          key={tag.id} 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => handleAddExistingTag(tag.id)}
                        >
                          {tag.name}
                        </Button>
                      ))
                    )}
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-sm font-medium">Create new tag</div>
                    <div className="flex items-center mt-1 gap-1">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        className="h-8"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim() || createTagMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
