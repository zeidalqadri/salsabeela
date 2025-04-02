import { MetricsCollector } from '@/modules/monitoring/MetricsCollector'
import { LoggerService } from '@/modules/monitoring/LoggerService'
import { Document, Entity, Project, DocumentStatus } from '../database/types'
import { DatabaseService } from '../database/service'

interface MetricPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

interface TimeRange {
  start: Date
  end: Date
}

interface DashboardStats {
  totalDocuments: number
  activeUsers: number
  documentSources: string[]
  totalEntities: number
  weeklyChanges: {
    documents: number
    users: number
    entities: number
  }
}

interface DocumentMetrics {
  total: number
  byStatus: Record<string, number>
  bySeverity: Record<string, number>
  averageEntities: number
  processingTime: {
    min: number
    max: number
    average: number
  }
}

interface EntityMetrics {
  total: number
  byType: Record<string, number>
  averageConfidence: number
}

interface ProjectMetrics {
  total: number
  active: number
  archived: number
  averageDocuments: number
  averageEntities: number
}

interface SystemMetrics {
  requestsPerMinute: number
  averageResponseTime: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
}

interface DashboardData {
  timeRange: TimeRange
  documents: DocumentMetrics
  entities: EntityMetrics
  projects: ProjectMetrics
  system: SystemMetrics
}

export class AnalyticsService {
  private metrics: Map<string, MetricPoint[]> = new Map()
  private requestCounts: Map<number, number> = new Map()
  private responseTimes: number[] = []

  constructor(
    private metricsCollector: MetricsCollector,
    private logger: LoggerService,
    private databaseService: DatabaseService
  ) {
    this.startMetricsCollection()
  }

  private startMetricsCollection() {
    // Collect metrics every minute
    setInterval(() => {
      const now = Math.floor(Date.now() / 60000)
      this.requestCounts.set(now, 0)
      
      // Keep only the last hour of data
      const cutoff = now - 60
      for (const key of this.requestCounts.keys()) {
        if (key < cutoff) {
          this.requestCounts.delete(key)
        }
      }

      // Reset response times array every hour
      if (this.responseTimes.length > 3600) {
        this.responseTimes = this.responseTimes.slice(-3600)
      }
    }, 60000)
  }

  async trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const point: MetricPoint = {
      timestamp: new Date(),
      value,
      metadata
    }

    const points = this.metrics.get(name) || []
    points.push(point)
    this.metrics.set(name, points)

    // Forward to metrics collector for real-time monitoring
    await this.metricsCollector.trackMetric(name, value, metadata)
  }

  async getMetric(name: string, range?: TimeRange): Promise<MetricPoint[]> {
    const points = this.metrics.get(name) || []
    
    if (!range) return points

    return points.filter(point => 
      point.timestamp >= range.start && point.timestamp <= range.end
    )
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get current metrics
    const currentDocs = await this.getMetric('total_documents')
    const currentUsers = await this.getMetric('active_users')
    const currentEntities = await this.getMetric('total_entities')
    const sources = await this.getMetric('document_sources')

    // Get week-ago metrics
    const lastWeekDocs = (await this.getMetric('total_documents', {
      start: weekAgo,
      end: now
    })).pop()?.value || 0

    const lastWeekUsers = (await this.getMetric('active_users', {
      start: weekAgo,
      end: now
    })).pop()?.value || 0

    const lastWeekEntities = (await this.getMetric('total_entities', {
      start: weekAgo,
      end: now
    })).pop()?.value || 0

    return {
      totalDocuments: currentDocs[currentDocs.length - 1]?.value || 0,
      activeUsers: currentUsers[currentUsers.length - 1]?.value || 0,
      documentSources: sources[sources.length - 1]?.metadata?.sources || [],
      totalEntities: currentEntities[currentEntities.length - 1]?.value || 0,
      weeklyChanges: {
        documents: (currentDocs[currentDocs.length - 1]?.value || 0) - lastWeekDocs,
        users: (currentUsers[currentUsers.length - 1]?.value || 0) - lastWeekUsers,
        entities: (currentEntities[currentEntities.length - 1]?.value || 0) - lastWeekEntities
      }
    }
  }

  async generateReport(metrics: string[], range: TimeRange) {
    const report: Record<string, MetricPoint[]> = {}

    for (const metric of metrics) {
      report[metric] = await this.getMetric(metric, range)
    }

    return report
  }

  async cleanup(olderThan: Date) {
    for (const [name, points] of this.metrics.entries()) {
      const filtered = points.filter(point => point.timestamp >= olderThan)
      this.metrics.set(name, filtered)
    }
  }

  async recordRequest(responseTime: number) {
    const minute = Math.floor(Date.now() / 60000)
    const count = this.requestCounts.get(minute) || 0
    this.requestCounts.set(minute, count + 1)
    this.responseTimes.push(responseTime)
  }

  async trackRequest(path: string, duration: number, statusCode: number) {
    await this.metricsCollector.trackMetric('request_count', 1, { path })
    await this.metricsCollector.trackMetric('response_time', duration, { path, statusCode })
    
    if (statusCode >= 400) {
      await this.metricsCollector.trackMetric('error_count', 1, { path, statusCode })
    }
  }

  private async getSystemMetrics(range: TimeRange): Promise<SystemMetrics> {
    const requestPoints = await this.metricsCollector.getMetricRange(
      'request_count',
      range.start.getTime(),
      range.end.getTime()
    )

    const responseTimePoints = await this.metricsCollector.getMetricRange(
      'response_time',
      range.start.getTime(),
      range.end.getTime()
    )

    const errorPoints = await this.metricsCollector.getMetricRange(
      'error_count',
      range.start.getTime(),
      range.end.getTime()
    )

    const requestCount = requestPoints.length
    const totalResponseTime = responseTimePoints.reduce((sum, p) => sum + p.value, 0)
    const errorCount = errorPoints.length

    return {
      requestsPerMinute: requestCount / ((range.end.getTime() - range.start.getTime()) / 60000),
      averageResponseTime: requestCount > 0 ? totalResponseTime / requestCount : 0,
      errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
      cpuUsage: 0, // Would need system monitoring integration
      memoryUsage: 0 // Would need system monitoring integration
    }
  }

  private async getDocumentMetrics(range: TimeRange): Promise<DocumentMetrics> {
    const documents = await this.databaseService.getAllDocuments()
    const filteredDocs = documents.filter(
      doc => new Date(doc.createdAt) >= range.start && new Date(doc.createdAt) <= range.end
    )

    const byStatus: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    let totalEntities = 0
    const processingTimes: number[] = []

    for (const doc of filteredDocs) {
      byStatus[doc.status] = (byStatus[doc.status] || 0) + 1
      bySeverity[doc.severity] = (bySeverity[doc.severity] || 0) + 1
      totalEntities += doc.entities.length
      
      const processTime = new Date(doc.updatedAt).getTime() - new Date(doc.createdAt).getTime()
      processingTimes.push(processTime)
    }

    return {
      total: filteredDocs.length,
      byStatus,
      bySeverity,
      averageEntities: filteredDocs.length > 0 ? totalEntities / filteredDocs.length : 0,
      processingTime: {
        min: Math.min(...processingTimes),
        max: Math.max(...processingTimes),
        average: processingTimes.length > 0 
          ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
          : 0
      }
    }
  }

  private async getEntityMetrics(range: TimeRange): Promise<EntityMetrics> {
    const documents = await this.databaseService.getAllDocuments()
    const entities = documents
      .filter(doc => new Date(doc.createdAt) >= range.start && new Date(doc.createdAt) <= range.end)
      .flatMap(doc => doc.entities)

    const byType: Record<string, number> = {}
    let totalConfidence = 0

    for (const entity of entities) {
      byType[entity.entityType] = (byType[entity.entityType] || 0) + 1
      totalConfidence += entity.confidence
    }

    return {
      total: entities.length,
      byType,
      averageConfidence: entities.length > 0 ? totalConfidence / entities.length : 0
    }
  }

  private async getProjectMetrics(range: TimeRange): Promise<ProjectMetrics> {
    const projects = await this.databaseService.getAllProjects()
    const filteredProjects = projects.filter(
      (project: Project) => new Date(project.createdAt) >= range.start && new Date(project.createdAt) <= range.end
    )

    const documents = await this.databaseService.getAllDocuments()
    const projectDocuments: Record<string, Document[]> = {}
    let totalDocuments = 0
    let totalEntities = 0

    for (const doc of documents) {
      if (!projectDocuments[doc.projectId]) {
        projectDocuments[doc.projectId] = []
      }
      projectDocuments[doc.projectId].push(doc)
      totalDocuments++
      totalEntities += doc.entities.length
    }

    return {
      total: filteredProjects.length,
      active: filteredProjects.filter((project: Project) => project.status === 'active').length,
      archived: filteredProjects.filter((project: Project) => project.status === 'archived').length,
      averageDocuments: filteredProjects.length > 0 ? totalDocuments / filteredProjects.length : 0,
      averageEntities: filteredProjects.length > 0 ? totalEntities / filteredProjects.length : 0
    }
  }

  async getDashboardData(range: TimeRange): Promise<DashboardData> {
    const [
      documents,
      entities,
      projects,
      system
    ] = await Promise.all([
      this.getDocumentMetrics(range),
      this.getEntityMetrics(range),
      this.getProjectMetrics(range),
      this.getSystemMetrics(range)
    ])

    return {
      timeRange: range,
      documents,
      entities,
      projects,
      system
    }
  }
} 