import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const batchTagSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document must be selected'),
  tagIds: z.array(z.string()).min(1, 'At least one tag must be selected'),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validation = batchTagSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { documentIds, tagIds } = validation.data;

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

    // Verify all tags exist
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        userId: session.user.id,
      },
    });

    if (tags.length !== tagIds.length) {
      return NextResponse.json(
        { error: 'One or more tags not found' },
        { status: 404 }
      );
    }

    // Add tags to documents
    await Promise.all(
      documentIds.map((documentId) =>
        prisma.document.update({
          where: { id: documentId },
          data: {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully tagged ${documents.length} documents`,
    });
  } catch (error) {
    console.error('Batch tag error:', error);
    return NextResponse.json(
      { error: 'Failed to tag documents' },
      { status: 500 }
    );
  }
} 