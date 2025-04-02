import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAuth, isSession } from '@/lib/auth-utils';

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

/**
 * GET /api/tags
 * Get all tags for the authenticated user
 */
export async function GET() {
  const result = await requireAuth();
  
  if (!isSession(result)) {
    return result;
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: result.user.id,
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tags
 * Create a new tag for the authenticated user
 */
export async function POST(request: NextRequest) {
  const result = await requireAuth();
  
  if (!isSession(result)) {
    return result;
  }

  try {
    const body = await request.json();
    const { name, color } = createTagSchema.parse(body);

    // Check if tag with same name already exists for user
    const existingTag = await prisma.tag.findFirst({
      where: {
        userId: result.user.id,
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#94A3B8', // Default color if none provided
        userId: result.user.id,
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
