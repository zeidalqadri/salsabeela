import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tagIdsSchema = z.object({
  tagIds: z.array(z.string())
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        OR: [
          { userId: session.user.id },
          { shares: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        _count: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!document) {
      return new NextResponse('Document not found', { status: 404 });
    }

    return NextResponse.json(document.tags);
  } catch (error) {
    console.error('Error fetching document tags:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!document) {
      return new NextResponse('Document not found or unauthorized', { status: 404 });
    }

    const body = await request.json();
    const { tagIds } = tagIdsSchema.parse(body);

    // Update document tags
    await prisma.document.update({
      where: { id: params.id },
      data: {
        tags: {
          deleteMany: {},
          create: tagIds.map(tagId => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    const updatedDocument = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(updatedDocument?.tags ?? []);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('Error updating document tags:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 