import { create } from 'zustand'
import { Document } from '@/modules/database/types'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

interface SearchFilters {
  fileType?: string[]
  dateRange?: {
    start: Date | null
    end: Date | null
  }
  status?: Document['status'][]
  entityTypes?: string[]
}

interface PaginationState {
  currentPage: number
  totalPages: number
  resultsPerPage: number
  totalResults: number
}

interface DocumentState {
  documents: Document[]
  filteredDocuments: Document[]
  searchQuery: string
  filters: SearchFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
  selectedDocument: Document | null
  // Actions
  setDocuments: (documents: Document[]) => void
  addDocument: (document: Document) => void
  removeDocument: (id: string) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  setPagination: (pagination: Partial<PaginationState>) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setSelectedDocument: (document: Document | null) => void
  // Async actions
  searchDocuments: (query: string, filters?: SearchFilters) => Promise<void>
  fetchDocuments: () => Promise<void>
  // Helper functions
  applyFilters: () => void
  applyPagination: () => Document[]
}

const RESULTS_PER_PAGE = 10

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  filteredDocuments: [],
  searchQuery: '',
  filters: {
    fileType: [],
    dateRange: { start: null, end: null },
    status: [],
    entityTypes: []
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: RESULTS_PER_PAGE,
    totalResults: 0
  },
  isLoading: false,
  error: null,
  selectedDocument: null,

  setDocuments: (documents) => {
    const state = get()
    set({ 
      documents,
      filteredDocuments: documents,
      pagination: {
        ...state.pagination,
        totalResults: documents.length,
        totalPages: Math.ceil(documents.length / state.pagination.resultsPerPage)
      }
    })
    state.applyFilters()
  },

  addDocument: (document) => {
    const state = get()
    const newDocuments = [...state.documents, document]
    state.setDocuments(newDocuments)
  },

  removeDocument: (id) => {
    const state = get()
    const newDocuments = state.documents.filter(doc => doc.id !== id)
    state.setDocuments(newDocuments)
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (filters) => {
    const state = get()
    set({ 
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, currentPage: 1 }
    })
    state.applyFilters()
  },

  setPagination: (pagination) => {
    const state = get()
    set({ 
      pagination: { ...state.pagination, ...pagination }
    })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedDocument: (document) => set({ selectedDocument: document }),

  applyFilters: () => {
    const { documents, filters, searchQuery } = get()
    
    let filtered = [...documents]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc => 
        doc.filename.toLowerCase().includes(query) ||
        doc.entities.some(entity => 
          entity.value.toLowerCase().includes(query) ||
          entity.name.toLowerCase().includes(query)
        )
      )
    }

    // Apply file type filter
    if (filters.fileType && filters.fileType.length > 0) {
      filtered = filtered.filter(doc => filters.fileType!.includes(doc.fileType))
    }

    // Apply date range filter
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.createdAt)
        const start = filters.dateRange?.start
        const end = filters.dateRange?.end

        if (start && end) {
          return docDate >= start && docDate <= end
        } else if (start) {
          return docDate >= start
        } else if (end) {
          return docDate <= end
        }
        return true
      })
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(doc => filters.status!.includes(doc.status))
    }

    // Apply entity type filter
    if (filters.entityTypes && filters.entityTypes.length > 0) {
      filtered = filtered.filter(doc =>
        doc.entities.some(entity => filters.entityTypes!.includes(entity.entityType))
      )
    }

    // Update pagination
    const { pagination } = get()
    const totalResults = filtered.length
    const totalPages = Math.ceil(totalResults / pagination.resultsPerPage)

    set({ 
      filteredDocuments: filtered,
      pagination: {
        ...pagination,
        totalResults,
        totalPages,
        currentPage: Math.min(pagination.currentPage, totalPages || 1)
      }
    })
  },

  applyPagination: () => {
    const { filteredDocuments, pagination } = get()
    const start = (pagination.currentPage - 1) * pagination.resultsPerPage
    const end = start + pagination.resultsPerPage
    return filteredDocuments.slice(start, end)
  },

  searchDocuments: async (query, filters) => {
    const { setLoading, setError, setDocuments, setFilters } = get()
    const databaseService = ServiceContainer.getInstance().get<DatabaseService>('database')

    try {
      setLoading(true)
      setError(null)
      
      // Get all documents and filter them based on the search query
      const allDocuments = await databaseService.getAllDocuments()
      setDocuments(allDocuments)
      
      // Apply new filters if provided
      if (filters) {
        setFilters(filters)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search documents')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  },

  fetchDocuments: async () => {
    const { setLoading, setError, setDocuments } = get()
    const databaseService = ServiceContainer.getInstance().get<DatabaseService>('database')

    try {
      setLoading(true)
      setError(null)
      
      const documents = await databaseService.getAllDocuments()
      setDocuments(documents)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch documents')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }
})) 