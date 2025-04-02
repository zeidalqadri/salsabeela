import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { DocumentService } from '@/modules/documents/service';
import { prisma } from '@/lib/prisma';

const documentService = new DocumentService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await documentService.getDocument(params.id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Get document status error:', error);
    return NextResponse.json(
      { error: 'Failed to get document status' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await documentService.getDocument(params.id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedDocument = await documentService.updateDocument(params.id, {
      ...body,
      createdById: document.createdBy?.id
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Update document status error:', error);
    return NextResponse.json(
      { error: 'Failed to update document status' },
      { status: 500 }
    );
  }
} 