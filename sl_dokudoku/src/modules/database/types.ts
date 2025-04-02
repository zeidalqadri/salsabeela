export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type DocumentSeverity = 'low' | 'medium' | 'high'

export interface Entity {
  id: string;
  documentId: string;
  name: string;
  value: string;
  entityType: string;
  confidence: number;
  createdAt: string | Date;
}

export interface Document {
  id: string;
  projectId: string;
  filename: string;
  fileType: string;
  content?: string;
  metadata?: Record<string, any>;
  status: DocumentStatus;
  severity: DocumentSeverity;
  progress: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  entities: Entity[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  settings?: Record<string, any>;
  status: 'active' | 'archived';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectStatus {
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  progress: number;
}

export interface DocumentFilters {
  fileType?: string[];
  status?: DocumentStatus[];
  entityTypes?: string[];
  severity?: DocumentSeverity[];
}

export interface PaginationState {
  currentPage: number;
  resultsPerPage: number;
  totalResults: number;
  totalPages: number;
} 