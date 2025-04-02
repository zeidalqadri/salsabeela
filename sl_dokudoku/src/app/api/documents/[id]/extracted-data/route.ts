import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path if needed
import { prisma } from '@/lib/prisma';
import { ExtractedDatum } from '@prisma/client';
import { DocumentExtractionService } from '@/modules/document-extraction/service';

interface RouteContext {
  params: {
    id: string; // Document ID
  };
}

/**
 * GET /api/documents/[id]/extracted-data
 * Fetches extracted data points for a specific document, grouped by category.
 */
export async function GET(
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
      select: { userId: true },
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

    // Get extracted data
    const extractionService = DocumentExtractionService.getInstance();
    const extractedData = await extractionService.getExtractedData(params.id);

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error('Error fetching extracted data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
