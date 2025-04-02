export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface FolderNode extends Folder {
  children: FolderNode[];
  level: number;
  isExpanded?: boolean;
}

export interface FolderTreeProps {
  folders: FolderNode[];
  selectedFolderId?: string;
  onFolderSelect: (folderId: string) => void;
  onFolderCreate?: (parentId: string | null, name: string) => Promise<void>;
  onFolderDelete?: (folderId: string) => Promise<void>;
  onFolderRename?: (folderId: string, newName: string) => Promise<void>;
}

export interface UseFoldersResponse {
  folders: FolderNode[];
  isLoading: boolean;
  error: Error | null;
  createFolder: (parentId: string | null, name: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
} 