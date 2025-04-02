import { DatabaseService } from "@/modules/database/service"
import { DocumentProcessor } from "@/modules/documents/services/DocumentProcessor"
import { MetricsCollector } from "@/modules/monitoring/services/MetricsCollector"
import { LoggerService } from "@/modules/monitoring/services/LoggerService"
import { DocumentAnalyzer } from "@/modules/nlp/services/DocumentAnalyzer"

export class ServiceContainer {
  private static instance: ServiceContainer
  private services: Map<string, any>

  private constructor() {
    this.services = new Map()
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  public has(serviceName: string): boolean {
    return this.services.has(serviceName)
  }

  public register(serviceName: string, service: any): void {
    this.services.set(serviceName, service)
  }

  public get<T>(serviceName: string): T {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service ${serviceName} not found. Make sure services are initialized.`)
    }
    return this.services.get(serviceName) as T
  }
} 