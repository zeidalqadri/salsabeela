export interface MetricPoint {
  timestamp: Date;
  value: number;
  labels: Record<string, string>;
}

export interface Metric {
  name: string;
  description: string;
  unit: string;
  points: MetricPoint[];
}

export class MetricsCollector {
  private metrics: Map<string, Metric> = new Map();

  constructor() {
    // Initialize default metrics
    this.createMetric(
      "document_processing_duration",
      "Time taken to process documents",
      "milliseconds"
    );
    this.createMetric(
      "entity_extraction_count",
      "Number of entities extracted",
      "count"
    );
    this.createMetric(
      "document_upload_size",
      "Size of uploaded documents",
      "bytes"
    );
    this.createMetric(
      "processing_errors",
      "Number of processing errors",
      "count"
    );
  }

  private createMetric(name: string, description: string, unit: string) {
    this.metrics.set(name, {
      name,
      description,
      unit,
      points: []
    });
  }

  record(name: string, value: number, labels: Record<string, string> = {}) {
    const metric = this.metrics.get(name);
    if (!metric) {
      throw new Error(`Metric ${name} not found`);
    }

    metric.points.push({
      timestamp: new Date(),
      value,
      labels
    });
  }

  getMetric(name: string): Metric | undefined {
    return this.metrics.get(name);
  }

  getMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  getMetricsSummary(): Record<string, { current: number; average: number }> {
    const summary: Record<string, { current: number; average: number }> = {};

    for (const [name, metric] of this.metrics.entries()) {
      if (metric.points.length === 0) {
        summary[name] = { current: 0, average: 0 };
        continue;
      }

      const current = metric.points[metric.points.length - 1].value;
      const average = metric.points.reduce((sum, point) => sum + point.value, 0) / metric.points.length;

      summary[name] = { current, average };
    }

    return summary;
  }
} 