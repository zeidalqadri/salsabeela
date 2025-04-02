import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateRequest } from '@/lib/validate-request'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  settings: z.record(z.string(), z.any()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, createProjectSchema)
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 })
    }

    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const project = await databaseService.createProject({
      ...validation.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const projects = await databaseService.getProjects({
      page,
      limit,
      status: status as 'active' | 'archived' | undefined
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Project API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 