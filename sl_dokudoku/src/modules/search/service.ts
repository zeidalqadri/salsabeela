import { Document, Entity, DocumentStatus, DocumentSeverity } from '../database/types'
import { DatabaseService } from '../database/service'
import MiniSearch from 'minisearch'

interface SearchOptions {
  fields?: string[]
  boost?: Record<string, number>
  fuzzy?: number | boolean
  prefix?: boolean
}

interface SearchResult<T> {
  id: string
  score: number
  terms: string[]
  match: Record<string, string[]>
  document: T
}

interface SearchDocument {
  id: string
  projectId: string
  filename: string
  fileType: string
  content: string
  metadata: Record<string, any>
  status: DocumentStatus
  severity: DocumentSeverity
  progress: number
  createdAt: string
  updatedAt: string
  entities: string[]
}

interface SearchEntity {
  id: string
  documentId: string
  name: string
  value: string
  entityType: string
  confidence: number
  createdAt: string
}

export class SearchService {
  private documentIndex: MiniSearch<SearchDocument>
  private entityIndex: MiniSearch<SearchEntity>

  constructor(private databaseService: DatabaseService) {
    this.documentIndex = new MiniSearch<SearchDocument>({
      fields: ['filename', 'content', 'metadata'],
      storeFields: ['filename', 'status', 'severity', 'projectId', 'createdAt'],
      searchOptions: {
        boost: { filename: 2 },
        fuzzy: 0.2
      }
    })

    this.entityIndex = new MiniSearch<SearchEntity>({
      fields: ['name', 'value', 'entityType'],
      storeFields: ['documentId', 'confidence', 'createdAt'],
      searchOptions: {
        boost: { entityType: 2 },
        fuzzy: 0.2
      }
    })

    void this.initializeIndices()
  }

  private async initializeIndices(): Promise<void> {
    const documents = await this.databaseService.getAllDocuments()
    const searchDocuments: SearchDocument[] = documents.map(doc => ({
      id: doc.id,
      projectId: doc.projectId,
      filename: doc.filename,
      fileType: doc.fileType,
      content: doc.content || '',
      metadata: doc.metadata || {},
      status: doc.status,
      severity: doc.severity,
      progress: doc.progress,
      createdAt: doc.createdAt.toString(),
      updatedAt: doc.updatedAt.toString(),
      entities: doc.entities.map(e => e.id)
    }))
    this.documentIndex.addAll(searchDocuments)

    for (const doc of documents) {
      const entities = await this.databaseService.getDocumentEntities(doc.id)
      const searchEntities: SearchEntity[] = entities.map(entity => ({
        id: entity.id,
        documentId: entity.documentId,
        name: entity.name,
        value: entity.value,
        entityType: entity.entityType,
        confidence: entity.confidence,
        createdAt: entity.createdAt.toString()
      }))
      this.entityIndex.addAll(searchEntities)
    }
  }

  async indexDocument(document: Document): Promise<void> {
    const searchDocument: SearchDocument = {
      id: document.id,
      projectId: document.projectId,
      filename: document.filename,
      fileType: document.fileType,
      content: document.content || '',
      metadata: document.metadata || {},
      status: document.status,
      severity: document.severity,
      progress: document.progress,
      createdAt: document.createdAt.toString(),
      updatedAt: document.updatedAt.toString(),
      entities: document.entities.map(e => e.id)
    }
    this.documentIndex.add(searchDocument)
  }

  async indexEntity(entity: Entity): Promise<void> {
    const searchEntity: SearchEntity = {
      id: entity.id,
      documentId: entity.documentId,
      name: entity.name,
      value: entity.value,
      entityType: entity.entityType,
      confidence: entity.confidence,
      createdAt: entity.createdAt.toString()
    }
    this.entityIndex.add(searchEntity)
  }

  async removeDocument(documentId: string): Promise<void> {
    this.documentIndex.remove({ id: documentId } as SearchDocument)
  }

  async removeEntity(entityId: string): Promise<void> {
    this.entityIndex.remove({ id: entityId } as SearchEntity)
  }

  async searchDocuments(query: string, options: SearchOptions = {}): Promise<SearchResult<Document>[]> {
    const results = this.documentIndex.search(query, {
      ...options,
      boost: { ...options.boost, filename: 2 }
    })

    const documents = await Promise.all(
      results.map(async result => {
        const doc = await this.databaseService.getDocument(result.id)
        if (!doc) throw new Error(`Document not found: ${result.id}`)
        return doc
      })
    )

    return results.map((result, index) => ({
      id: result.id,
      score: result.score,
      terms: result.terms,
      match: result.match,
      document: documents[index]
    }))
  }

  async searchEntities(query: string, options: SearchOptions = {}): Promise<SearchResult<Entity>[]> {
    const results = this.entityIndex.search(query, {
      ...options,
      boost: { ...options.boost, entityType: 2 }
    })

    const entities = await Promise.all(
      results.map(async result => {
        const entityList = await this.databaseService.getDocumentEntities(result.id)
        const entity = entityList.find(e => e.id === result.id)
        if (!entity) throw new Error(`Entity not found: ${result.id}`)
        return entity
      })
    )

    return results.map((result, index) => ({
      id: result.id,
      score: result.score,
      terms: result.terms,
      match: result.match,
      document: entities[index]
    }))
  }

  async reindexAll(): Promise<void> {
    this.documentIndex.removeAll()
    this.entityIndex.removeAll()
    await this.initializeIndices()
  }
} 