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

    // Check if user has permission to view
    if (document.createdBy?.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // For now, we'll return an empty array as entities are not implemented yet
    return NextResponse.json([]);
  } catch (error) {
    console.error('Get entities error:', error);
    return NextResponse.json(
      { error: 'Failed to get document entities' },
      { status: 500 }
    );
  }
} 