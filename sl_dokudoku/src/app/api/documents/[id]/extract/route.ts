import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { DocumentExtractionService } from '@/modules/document-extraction/service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      select: { content: true, userId: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || document.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!document.content) {
      return NextResponse.json(
        { error: 'Document has no content' },
        { status: 400 }
      );
    }

    // Extract information
    const extractionService = DocumentExtractionService.getInstance();
    const result = await extractionService.extractInformation(
      params.id,
      document.content
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Extraction failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in document extraction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 