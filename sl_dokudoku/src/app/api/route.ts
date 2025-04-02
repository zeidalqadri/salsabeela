import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { validateRequest } from '@/lib/validate-request'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { AdminService } from '@/modules/admin/service'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})

export async function middleware(request: NextRequest) {
  try {
    await limiter.check(request, 10, 'API_RATE_LIMIT')
  } catch {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const adminService = ServiceContainer.getInstance().get<AdminService>('admin')
    const key = await adminService.getAPIKey(apiKey)
    if (!key) {
      return new NextResponse('Invalid API Key', { status: 401 })
    }

    // Update last used timestamp
    key.lastUsed = new Date()

    return new NextResponse(JSON.stringify({
      status: 'ok',
      version: '1.0.0'
    }))
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 