import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateRequest } from '../../../../lib/validate'
import { ServiceContainer } from '@/modules/container'

const timeRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime()
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRange = {
      start: searchParams.get('start') || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end: searchParams.get('end') || new Date().toISOString()
    }

    const validation = await validateRequest({ timeRange }, { timeRange: timeRangeSchema })
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 })
    }

    const container = ServiceContainer.getInstance()
    const analyticsService = container.getAnalyticsService()

    const dashboardData = await analyticsService.getDashboardData({
      start: new Date(timeRange.start),
      end: new Date(timeRange.end)
    })

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 