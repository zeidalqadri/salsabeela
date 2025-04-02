import { query } from './db';

interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
}

class DatabaseMonitor {
  private metrics: QueryMetrics[] = [];
  private readonly MAX_METRICS = 100;

  async trackQuery(sqlQuery: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await query(sqlQuery, params);
      const duration = Date.now() - start;
      this.recordMetrics(sqlQuery, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordMetrics(sqlQuery, duration);
      throw error;
    }
  }

  async analyzeQueryPerformance(sqlQuery: string, params?: any[]): Promise<any> {
    const explainQuery = `EXPLAIN ANALYZE ${sqlQuery}`;
    return query(explainQuery, params);
  }

  async getConnectionStats(): Promise<any> {
    const result = await query('SELECT count(*) as active FROM pg_stat_activity WHERE state = $1', ['active']);
    return {
      activeConnections: parseInt(result.rows[0].active),
      timestamp: new Date()
    };
  }

  getQueryMetrics(): QueryMetrics[] {
    return this.metrics;
  }

  getSlowQueries(threshold: number = 500): QueryMetrics[] {
    return this.metrics.filter(m => m.duration > threshold);
  }

  private recordMetrics(sqlQuery: string, duration: number): void {
    this.metrics.push({
      query: sqlQuery,
      duration,
      timestamp: new Date()
    });

    // Keep only the most recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }
}

// Singleton instance
export const dbMonitor = new DatabaseMonitor(); 