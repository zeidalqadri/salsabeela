import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateRequest } from '@/lib/validate-request'
import { ServiceContainer } from '@/modules/core/services/ServiceContainer'
import { DatabaseService } from '@/modules/database/service'

const createEntitySchema = z.object({
  text: z.string().min(1),
  entityType: z.string().min(1),
  confidence: z.number().min(0).max(1)
})

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const validation = await validateRequest(request, createEntitySchema)
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 })
    }

    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    // Check if document exists
    const document = await databaseService.getDocument(params.documentId)
    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    const entity = await databaseService.createEntity({
      id: Math.random().toString(36).substring(7),
      documentId: params.documentId,
      createdAt: new Date().toISOString(),
      ...validation.data
    })

    return NextResponse.json(entity)
  } catch (error) {
    console.error('Entity API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const container = ServiceContainer.getInstance()
    const databaseService = container.get<DatabaseService>('database')

    // Check if document exists
    const document = await databaseService.getDocument(params.documentId)
    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    const entities = await databaseService.getDocumentEntities(params.documentId)
    return NextResponse.json(entities)
  } catch (error) {
    console.error('Entity API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 