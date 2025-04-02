import { NextRequest } from 'next/server'
import LRUCache from 'lru-cache'

interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitContext {
  timestamp: number
  count: number
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, RateLimitContext>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval
  })

  return {
    check: async (request: NextRequest, limit = 10, token = request.ip): Promise<RateLimitResult> => {
      const now = Date.now()
      const context = tokenCache.get(token) || { timestamp: now, count: 0 }

      if (now - context.timestamp > options.interval) {
        context.timestamp = now
        context.count = 0
      }

      context.count++
      tokenCache.set(token, context)

      return {
        success: context.count <= limit,
        limit,
        remaining: Math.max(0, limit - context.count),
        reset: context.timestamp + options.interval
      }
    }
  }
} 