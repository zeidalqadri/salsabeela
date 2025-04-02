import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RepositoryMonitor, RepositoryStats } from '../services/RepositoryMonitor';
import { DatabaseService } from '../../database/service';
import { MetricsCollector } from '../services/MetricsCollector';

interface DiagnosticsProps {
  databaseService: DatabaseService;
  metricsCollector: MetricsCollector;
}

export function RepositoryDiagnostics({ databaseService, metricsCollector }: DiagnosticsProps) {
  const [stats, setStats] = useState<RepositoryStats | null>(null);
  const [health, setHealth] = useState<{ status: string; issues: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const monitor = new RepositoryMonitor(databaseService, metricsCollector);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const report = await monitor.getDiagnosticReport();
        setStats(report.stats);
        setHealth(report.health);
      } catch (error) {
        console.error('Failed to fetch diagnostics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading diagnostics...</div>;
  }

  if (!stats || !health) {
    return <div>No diagnostic data available</div>;
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Repository Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`inline-block px-3 py-1 rounded-full text-white ${getHealthColor(health.status)}`}>
            {health.status.toUpperCase()}
          </div>
          {health.issues.length > 0 && (
            <Alert className="mt-4">
              <AlertTitle>Active Issues</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {health.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Processing Status</h4>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span>Total Documents</span>
                  <span>{stats.totalDocuments}</span>
                </div>
                <Progress
                  value={(stats.processingDocuments / stats.totalDocuments) * 100}
                  className="h-2"
                />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>Processing: {stats.processingDocuments}</span>
                  <span>Failed: {stats.failedDocuments}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Performance Metrics</h4>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span>Avg. Processing Time</span>
                  <span>{Math.round(stats.averageProcessingTime)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Used</span>
                  <span>{Math.round(stats.storageUsed / 1024 / 1024)}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Entity Extraction Rate</span>
                  <span>{stats.entityExtractionRate.toFixed(2)}/doc</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 