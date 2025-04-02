import type { Document as PrismaDocument, DocumentShare, DocumentVersion, User, Tag, Folder, DocumentTag } from '@prisma/client';

export type Document = PrismaDocument & {
  owner: User;
  shares: DocumentShare[];
  versions: DocumentVersion[];
  tags: {
    tag: Tag;
    documentId: string;
    tagId: string;
    createdAt: Date;
  }[];
};

export interface DocumentWithTags extends Document {
  tags: {
    tag: Tag;
    documentId: string;
    tagId: string;
    createdAt: Date;
  }[];
}

export interface DocumentWithSharedUser extends DocumentShare {
  user: User;
}

export interface DocumentWithRelations extends Document {
  owner: User;
  shares: DocumentWithSharedUser[];
  folder: Folder | null;
  _count: { // Add the count field
    comments: number;
    // Add other counts if needed (e.g., shares, versions)
  };
  tags: (DocumentTag & { tag: Tag })[];
}

export interface DocumentsResponse {
  documents: DocumentWithRelations[];
  total: number;
  pageSize: number;
  page: number;
}

export type DocumentsQueryParams = {
  page?: number
  pageSize?: number
  search?: string
  folderId?: string
  tagIds?: string[]
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
