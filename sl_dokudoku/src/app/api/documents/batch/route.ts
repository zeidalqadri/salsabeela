import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const batchDeleteSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document must be selected'),
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validation = batchDeleteSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { documentIds } = validation.data;

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

    // Delete documents
    await prisma.document.deleteMany({
      where: {
        id: { in: documentIds },
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${documents.length} documents`,
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete documents' },
      { status: 500 }
    );
  }
} 