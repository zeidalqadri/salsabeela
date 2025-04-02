import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        documentId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validation = commentSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if document exists and user has access
    const document = await prisma.document.findFirst({
      where: {
        id: params.id,
        OR: [
          { userId: session.user.id },
          {
            shares: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        documentId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: params.commentId,
        documentId: params.id,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Only allow comment author or document owner to delete
    if (comment.userId !== session.user.id) {
      const document = await prisma.document.findUnique({
        where: { id: params.id },
      });

      if (document?.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Not authorized to delete this comment' },
          { status: 403 }
        );
      }
    }

    await prisma.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
} 