export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  folderId?: string;
  version: number;
  tags?: string[];
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  createdAt: Date;
  createdById: string;
  changeDescription?: string;
} 