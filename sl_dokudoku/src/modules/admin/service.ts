import { AuthService } from '@/modules/auth/service'
import { StorageService } from '@/modules/storage/service'
import { LoggerService } from '@/modules/monitoring/LoggerService'

interface APIKey {
  id: string
  key: string
  name: string
  permissions: string[]
  createdAt: string
  lastUsed?: string
}

interface SystemConfig {
  processing: {
    maxConcurrent: number
    timeout: number
  }
  storage: {
    maxFileSize: number
    allowedTypes: string[]
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
  }
}

export class AdminService {
  private apiKeys: Map<string, APIKey> = new Map()
  private config: SystemConfig = {
    processing: {
      maxConcurrent: 5,
      timeout: 300000 // 5 minutes
    },
    storage: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['application/pdf', 'text/plain', 'application/msword']
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 3600000 // 1 hour
    }
  }

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private logger: LoggerService
  ) {}

  // API Key Management
  async createAPIKey(name: string, permissions: string[]): Promise<APIKey> {
    const id = Math.random().toString(36).substring(7)
    const key = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
    
    const apiKey: APIKey = {
      id,
      key,
      name,
      permissions,
      createdAt: new Date().toISOString()
    }
    
    this.apiKeys.set(key, apiKey)
    return apiKey
  }

  async getAPIKey(key: string): Promise<APIKey | null> {
    return this.apiKeys.get(key) || null
  }

  async listAPIKeys(): Promise<APIKey[]> {
    return Array.from(this.apiKeys.values())
  }

  async updateAPIKey(id: string, data: Partial<Omit<APIKey, 'id' | 'key'>>): Promise<APIKey | null> {
    const apiKey = Array.from(this.apiKeys.values()).find(k => k.id === id)
    if (!apiKey) return null

    const updated = {
      ...apiKey,
      ...data
    }
    this.apiKeys.set(apiKey.key, updated)
    return updated
  }

  async revokeAPIKey(id: string): Promise<boolean> {
    const apiKey = Array.from(this.apiKeys.values()).find(k => k.id === id)
    if (!apiKey) return false

    return this.apiKeys.delete(apiKey.key)
  }

  // System Configuration
  async getConfig(): Promise<SystemConfig> {
    return this.config
  }

  async updateConfig(data: Partial<SystemConfig>): Promise<SystemConfig> {
    this.config = {
      ...this.config,
      ...data
    }
    return this.config
  }

  // User Management
  async createUser(email: string, password: string, role: string) {
    return this.authService.createUser(email, password, role)
  }

  async listUsers() {
    // This would be implemented in AuthService
    return []
  }

  // System Maintenance
  async getSystemStatus() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  }

  async cleanup(): Promise<void> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Remove expired API keys that haven't been used in 30 days
    for (const [key, apiKey] of this.apiKeys.entries()) {
      if (apiKey.lastUsed) {
        const lastUsed = new Date(apiKey.lastUsed)
        if (lastUsed < thirtyDaysAgo) {
          this.apiKeys.delete(key)
        }
      }
    }
  }
} 