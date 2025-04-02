import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const batchMoveSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document must be selected'),
  folderId: z.string().nullable(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validation = batchMoveSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { documentIds, folderId } = validation.data;

    // Verify user has access to all documents
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        userId: session.user.id,
      },
    });

    if (documents.length !== documentIds.length) {
      return NextResponse.json(
        { error: 'Access denied to one or more documents' },
        { status: 403 }
      );
    }

    // If folderId is provided, verify it exists and user has access
    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          userId: session.user.id,
        },
      });

      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Move documents
    await prisma.document.updateMany({
      where: {
        id: { in: documentIds },
        userId: session.user.id,
      },
      data: {
        folderId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully moved ${documents.length} documents`,
    });
  } catch (error) {
    console.error('Batch move error:', error);
    return NextResponse.json(
      { error: 'Failed to move documents' },
      { status: 500 }
    );
  }
} 