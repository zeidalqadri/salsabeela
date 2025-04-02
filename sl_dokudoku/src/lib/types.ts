/**
 * Represents a single metadata field associated with a document.
 */
export interface MetadataField {
  key: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  // Consider adding an ID if these fields need unique identification in the backend
  // id?: string; 
}

/**
 * Represents a configured cloud storage source for document ingestion.
 */
export interface CloudSource {
  id: string;
  name: string;
  type: 'google-drive' | 'dropbox' | 'onedrive' | 's3';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string; // Consider using Date type
}

/**
 * Represents a Document object including the User who created it.
 * Used for displaying document lists with creator information.
 */
import { Document, User } from '@prisma/client'; // Import base types

export type DocumentWithUser = Document & {
  createdBy: Pick<User, 'id' | 'name' | 'email' | 'image'> | null; // Select fields needed for display
};


// Add other shared types here as needed
