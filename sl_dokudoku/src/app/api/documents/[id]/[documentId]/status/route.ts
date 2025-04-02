import { NextRequest, NextResponse } from 'next/server'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const document = await databaseService.getDocument(params.documentId)
    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    return NextResponse.json({
      status: document.status,
      progress: document.progress,
      severity: document.severity,
      updatedAt: document.updatedAt
    })
  } catch (error) {
    console.error('Document Status API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    const document = await databaseService.getDocument(params.documentId)
    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    const data = await request.json()
    const { status, progress } = data

    const updated = await databaseService.updateDocument(params.documentId, {
      status,
      progress,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Document Status API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 