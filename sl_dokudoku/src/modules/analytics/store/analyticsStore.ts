import { create } from 'zustand'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'
import { Document } from '@/modules/database/types'

interface AnalyticsMetrics {
  totalDocuments: number
  processedDocuments: number
  failedDocuments: number
  totalEntities: number
  averageEntitiesPerDocument: number
  processingSuccessRate: number
}

interface AnalyticsState {
  metrics: AnalyticsMetrics
  isLoading: boolean
  error: string | null
  // Actions
  setMetrics: (metrics: AnalyticsMetrics) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  // Async actions
  fetchMetrics: () => Promise<void>
}

const calculateMetrics = (documents: Document[]): AnalyticsMetrics => {
  const totalDocs = documents.length
  const processedDocs = documents.filter(doc => doc.status === 'completed').length
  const failedDocs = documents.filter(doc => doc.status === 'failed').length
  const totalEntities = documents.reduce((sum, doc) => sum + doc.entities.length, 0)
  
  return {
    totalDocuments: totalDocs,
    processedDocuments: processedDocs,
    failedDocuments: failedDocs,
    totalEntities,
    averageEntitiesPerDocument: totalDocs > 0 ? totalEntities / totalDocs : 0,
    processingSuccessRate: totalDocs > 0 ? (processedDocs / totalDocs) * 100 : 0
  }
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  metrics: {
    totalDocuments: 0,
    processedDocuments: 0,
    failedDocuments: 0,
    totalEntities: 0,
    averageEntitiesPerDocument: 0,
    processingSuccessRate: 0
  },
  isLoading: false,
  error: null,

  setMetrics: (metrics) => set({ metrics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchMetrics: async () => {
    const databaseService = ServiceContainer.getInstance().get<DatabaseService>('database')

    try {
      set({ isLoading: true, error: null })
      
      const documents = await databaseService.getAllDocuments()
      const metrics = calculateMetrics(documents)
      
      set({ metrics })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics metrics',
        metrics: {
          totalDocuments: 0,
          processedDocuments: 0,
          failedDocuments: 0,
          totalEntities: 0,
          averageEntitiesPerDocument: 0,
          processingSuccessRate: 0
        }
      })
    } finally {
      set({ isLoading: false })
    }
  }
})) 