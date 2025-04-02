import { Document, Entity, DocumentStatus, DocumentSeverity, Project, ProjectStatus } from './types'

interface GetProjectsOptions {
  page: number
  limit: number
  status?: 'active' | 'archived'
}

interface GetProjectsResult {
  items: Project[]
  total: number
  page: number
  totalPages: number
}

export class DatabaseService {
  private projects: Map<string, Project> = new Map()
  private documents: Map<string, Document> = new Map()
  private entities: Map<string, Entity> = new Map()

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = Math.random().toString(36).substring(7)
    const now = new Date().toISOString()
    const project: Project = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    }
    this.projects.set(id, project)
    return project
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  async getProjects(options: GetProjectsOptions): Promise<GetProjectsResult> {
    const { page, limit, status } = options
    const start = (page - 1) * limit
    const end = start + limit

    let filtered = Array.from(this.projects.values())
    if (status) {
      filtered = filtered.filter(p => p.status === status)
    }

    return {
      items: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit)
    }
  }

  async updateProject(id: string, data: Partial<Omit<Project, 'id'>>): Promise<Project | null> {
    const project = await this.getProject(id)
    if (!project) return null

    const updated = {
      ...project,
      ...data,
      updatedAt: new Date().toISOString()
    }
    this.projects.set(id, updated)
    return updated
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id)
  }

  async createDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'entities'>): Promise<Document> {
    const id = Math.random().toString(36).substring(7)
    const now = new Date().toISOString()
    const document: Document = {
      id,
      ...data,
      entities: [],
      createdAt: now,
      updatedAt: now
    }
    this.documents.set(id, document)
    return document
  }

  async getDocument(id: string): Promise<Document | null> {
    return this.documents.get(id) || null
  }

  async getProjectDocuments(projectId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.projectId === projectId)
  }

  async updateDocument(id: string, data: Partial<Omit<Document, 'id'>>): Promise<Document | null> {
    const document = await this.getDocument(id)
    if (!document) return null

    const updated = {
      ...document,
      ...data,
      updatedAt: new Date().toISOString()
    }
    this.documents.set(id, updated)
    return updated
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id)
  }

  async createEntity(data: Omit<Entity, 'id' | 'createdAt'>): Promise<Entity> {
    const id = Math.random().toString(36).substring(7)
    const now = new Date().toISOString()
    const entity: Entity = {
      id,
      ...data,
      createdAt: now
    }
    this.entities.set(id, entity)

    const document = await this.getDocument(entity.documentId)
    if (document) {
      document.entities.push(entity)
      document.updatedAt = new Date().toISOString()
      this.documents.set(document.id, document)
    }
    return entity
  }

  async getDocumentEntities(documentId: string): Promise<Entity[]> {
    return Array.from(this.entities.values())
      .filter(entity => entity.documentId === documentId)
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    progress?: number
  ): Promise<Document | null> {
    const document = this.documents.get(documentId)
    if (document) {
      document.status = status
      if (progress !== undefined) {
        document.progress = progress
      }
      document.updatedAt = new Date().toISOString()
      return document
    }
    return null
  }

  async getProjectStatus(projectId: string): Promise<ProjectStatus> {
    const documents = await this.getProjectDocuments(projectId)
    const total = documents.length
    
    if (total === 0) {
      return {
        activeJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        progress: 0
      }
    }

    const active = documents.filter(doc => doc.status === 'processing').length
    const completed = documents.filter(doc => doc.status === 'completed').length
    const failed = documents.filter(doc => doc.status === 'failed').length
    const progress = documents.reduce((sum, doc) => sum + (doc.progress || 0), 0) / total

    return {
      activeJobs: active,
      completedJobs: completed,
      failedJobs: failed,
      progress
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values())
  }

  async getDocumentsByProject(projectId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.projectId === projectId)
  }

  async getAllProjects(): Promise<Project[]> {
    const { items } = await this.getProjects({ page: 1, limit: 1000 })
    return items
  }
} 