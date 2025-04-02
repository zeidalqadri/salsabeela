import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateRequest } from '@/lib/validate-request'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

const updateStatusSchema = z.object({
  status: z.enum(['active', 'archived'])
})

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const project = await databaseService.getProject(params.projectId)
    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    return NextResponse.json({
      status: project.status,
      updatedAt: project.updatedAt
    })
  } catch (error) {
    console.error('Project Status API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const validation = await validateRequest(request, updateStatusSchema)
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 })
    }

    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const project = await databaseService.getProject(params.projectId)
    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const updated = await databaseService.updateProject(params.projectId, {
      status: validation.data.status
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Project Status API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 