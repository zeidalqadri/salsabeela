interface MetricPoint {
  timestamp: number
  value: number
  metadata?: Record<string, any>
}

interface MetricSummary {
  min: number
  max: number
  average: number
  count: number
  sum: number
  lastValue: number
  lastTimestamp: number
}

export class MetricsCollector {
  private metrics: Map<string, MetricPoint[]> = new Map()
  private readonly maxPoints = 1000 // Keep last 1000 points per metric

  async trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const points = this.metrics.get(name) || []
    const point: MetricPoint = {
      timestamp: Date.now(),
      value,
      metadata
    }

    points.push(point)

    // Keep only the last maxPoints
    if (points.length > this.maxPoints) {
      points.splice(0, points.length - this.maxPoints)
    }

    this.metrics.set(name, points)
  }

  async getMetric(name: string): Promise<MetricPoint[]> {
    return this.metrics.get(name) || []
  }

  async getMetricSummary(name: string): Promise<MetricSummary | null> {
    const points = await this.getMetric(name)
    if (points.length === 0) return null

    const values = points.map(p => p.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const lastPoint = points[points.length - 1]

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      average: sum / points.length,
      count: points.length,
      sum,
      lastValue: lastPoint.value,
      lastTimestamp: lastPoint.timestamp
    }
  }

  async getMetricRange(
    name: string,
    start: number,
    end: number
  ): Promise<MetricPoint[]> {
    const points = await this.getMetric(name)
    return points.filter(p => p.timestamp >= start && p.timestamp <= end)
  }

  async listMetrics(): Promise<string[]> {
    return Array.from(this.metrics.keys())
  }

  async clearMetric(name: string) {
    this.metrics.delete(name)
  }

  async clearAllMetrics() {
    this.metrics.clear()
  }
} 