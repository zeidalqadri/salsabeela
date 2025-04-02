import { NextRequest, NextResponse } from 'next/server'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    // Check if project exists
    const project = await databaseService.getProject(params.projectId)
    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const documents = await databaseService.getProjectDocuments(params.projectId)
    return NextResponse.json({
      items: documents,
      total: documents.length
    })
  } catch (error) {
    console.error('Project Documents API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 