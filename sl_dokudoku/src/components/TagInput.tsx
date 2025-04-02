import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TagBadge } from '@/components/TagBadge';
import { useTags } from '@/hooks/useTags';
import type { Tag } from '@prisma/client';
import type { TagInputProps } from '@/types/tag';
import { cn } from '@/lib/utils';

export function TagInput({ onTagSelect, selectedTags = [], className }: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { tags, isLoading } = useTags();

  const handleTagClick = (tag: Tag) => {
    onTagSelect(tag);
    setIsOpen(false);
  };

  const availableTags = tags.filter(
    tag => !selectedTags.some(selected => selected.id === tag.id)
  );

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {selectedTags.map(tag => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={isLoading || availableTags.length === 0}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="flex flex-col gap-2">
            {availableTags.map(tag => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={() => handleTagClick(tag)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 