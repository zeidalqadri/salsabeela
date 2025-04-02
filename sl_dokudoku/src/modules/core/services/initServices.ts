import { ServiceContainer } from "./ServiceContainer"
import { DatabaseService } from "@/modules/database/service"
import { LoggerService } from "@/modules/monitoring/LoggerService"
import { MetricsCollector } from "@/modules/monitoring/MetricsCollector"
import { DocumentAnalyzer } from "@/modules/documents/services/DocumentAnalyzer"
import { DocumentProcessor } from "@/modules/documents/services/DocumentProcessor"

export function initializeServices() {
  const container = ServiceContainer.getInstance()
  
  // Initialize core services
  if (!container.has('database')) {
    container.register('database', new DatabaseService())
  }
  
  if (!container.has('logger')) {
    container.register('logger', new LoggerService())
  }
  
  if (!container.has('metrics')) {
    container.register('metrics', new MetricsCollector())
  }

  // Initialize dependent services
  if (!container.has('documentAnalyzer')) {
    const metricsCollector = container.get<MetricsCollector>('metrics')
    container.register('documentAnalyzer', new DocumentAnalyzer(metricsCollector))
  }

  if (!container.has('documentProcessor')) {
    const databaseService = container.get<DatabaseService>('database')
    const metricsCollector = container.get<MetricsCollector>('metrics')
    const logger = container.get<LoggerService>('logger')
    container.register('documentProcessor', new DocumentProcessor(databaseService, metricsCollector, logger))
  }
} 