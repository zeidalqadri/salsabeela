import { MetricsCollector } from './MetricsCollector';
import { DatabaseService } from '../../database/service';
import { Document } from '../../database/types';

export interface RepositoryStats {
  totalDocuments: number;
  processingDocuments: number;
  failedDocuments: number;
  averageProcessingTime: number;
  storageUsed: number;
  entityExtractionRate: number;
}

export class RepositoryMonitor {
  constructor(
    private databaseService: DatabaseService,
    private metricsCollector: MetricsCollector
  ) {}

  async getRepositoryStats(): Promise<RepositoryStats> {
    const documents = await this.databaseService.getAllDocuments();
    const metrics = this.metricsCollector.getMetricsSummary();

    const processingDocs = documents.filter((doc: Document) => doc.status === 'processing');
    const failedDocs = documents.filter((doc: Document) => doc.status === 'failed');

    const stats: RepositoryStats = {
      totalDocuments: documents.length,
      processingDocuments: processingDocs.length,
      failedDocuments: failedDocs.length,
      averageProcessingTime: metrics.document_processing_duration?.average || 0,
      storageUsed: documents.reduce((total: number, doc: Document) => total + (doc.size || 0), 0),
      entityExtractionRate: metrics.entity_extraction_count?.average || 0
    };

    return stats;
  }

  async checkRepositoryHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
  }> {
    const stats = await this.getRepositoryStats();
    const issues: string[] = [];

    // Check for processing bottlenecks
    if (stats.processingDocuments > stats.totalDocuments * 0.2) {
      issues.push('High number of documents stuck in processing');
    }

    // Check failure rate
    if (stats.failedDocuments > stats.totalDocuments * 0.1) {
      issues.push('High document processing failure rate');
    }

    // Check processing time
    if (stats.averageProcessingTime > 30000) { // 30 seconds
      issues.push('Document processing time is above threshold');
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (issues.length > 2) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'degraded';
    }

    return { status, issues };
  }

  async getDiagnosticReport(): Promise<{
    timestamp: Date;
    stats: RepositoryStats;
    health: { status: string; issues: string[] };
    metrics: Record<string, { current: number; average: number }>;
  }> {
    const [stats, health, metrics] = await Promise.all([
      this.getRepositoryStats(),
      this.checkRepositoryHealth(),
      Promise.resolve(this.metricsCollector.getMetricsSummary())
    ]);

    return {
      timestamp: new Date(),
      stats,
      health,
      metrics
    };
  }
} 