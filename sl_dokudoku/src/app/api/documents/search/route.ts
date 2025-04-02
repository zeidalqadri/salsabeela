import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { DocumentService } from '@/modules/documents/service';
import { prisma } from '@/lib/prisma';

const documentService = new DocumentService();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    const documents = await documentService.searchDocuments(user.id, query);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search documents' },
      { status: 500 }
    );
  }
} 