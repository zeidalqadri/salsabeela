import type { Tag } from '@prisma/client';

export interface TagBadgeProps {
  tag: Tag;
  className?: string;
  onClick?: () => void;
}

export interface UseTagsResponse {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  createTag: (name: string, color: string) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<void>;
  updateTag: (tagId: string, data: { name?: string; color?: string }) => Promise<Tag>;
}

export interface TagInputProps {
  onTagSelect: (tag: Tag) => void;
  selectedTags?: Tag[];
  className?: string;
} 