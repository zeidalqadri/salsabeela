// Define strict types for sharing functionality
export type Permission = 'VIEW' | 'EDIT';

export interface ShareUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  userId: string;
  permission: Permission;
  user: ShareUser;
}

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
  onShare: (users: string[], permission: Permission) => Promise<void>;
  initialShares?: DocumentShare[];
}

export interface ShareResponse {
  success: boolean;
  message: string;
  shares?: DocumentShare[];
} 