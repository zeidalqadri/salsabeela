import { AdminService } from './admin/service'
import { DatabaseService } from './database/service'
import { AuthService } from './auth/service'
import { StorageService } from './storage/service'
import { LoggerService } from './monitoring/LoggerService'
import { SearchService } from './search/service'
import { AnalyticsService } from './analytics/service'
import { MetricsCollector } from './monitoring/MetricsCollector'

export class ServiceContainer {
  private static instance: ServiceContainer | null = null
  private adminService!: AdminService
  private databaseService!: DatabaseService
  private authService!: AuthService
  private storageService!: StorageService
  private loggerService!: LoggerService
  private searchService!: SearchService
  private analyticsService!: AnalyticsService
  private metricsCollector!: MetricsCollector

  private constructor() {
    this.initialize()
  }

  private initialize() {
    this.databaseService = new DatabaseService()
    this.loggerService = new LoggerService()
    this.authService = new AuthService()
    this.storageService = new StorageService()
    this.metricsCollector = new MetricsCollector()
    this.adminService = new AdminService(
      this.authService,
      this.storageService,
      this.loggerService
    )
    this.searchService = new SearchService(this.databaseService)
    this.analyticsService = new AnalyticsService(
      this.metricsCollector,
      this.loggerService,
      this.databaseService
    )
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  getAdminService(): AdminService {
    return this.adminService
  }

  getDatabaseService(): DatabaseService {
    return this.databaseService
  }

  getAuthService(): AuthService {
    return this.authService
  }

  getStorageService(): StorageService {
    return this.storageService
  }

  getLoggerService(): LoggerService {
    return this.loggerService
  }

  getSearchService(): SearchService {
    return this.searchService
  }

  getAnalyticsService(): AnalyticsService {
    return this.analyticsService
  }

  getMetricsCollector(): MetricsCollector {
    return this.metricsCollector
  }
} 