import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const CreateFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentId: z.string().nullable().optional(),
});

/**
 * API route to get a list of folders for the authenticated user.
 * Can optionally filter by parentId (for subfolders) or list root folders.
 */
export async function GET(request: NextRequest) {
  try {
    // Temporarily skip authentication check for development
    // TODO: Re-enable authentication after MVP sign-off
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // For development, use a test user ID
    const testUserId = 'test-user-id'; // You can replace this with an actual user ID from your database

    const folders = await prisma.folder.findMany({
      where: {
        userId: testUserId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * API route to create a new folder for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    // Temporarily skip authentication check
    const testUserId = 'test-user-id';
    
    const body = await request.json();
    const result = CreateFolderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, parentId } = result.data;

    // If parentId is provided, verify it exists and belongs to user
    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: parentId,
          userId: testUserId,
        },
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: 'Parent folder not found' },
          { status: 404 }
        );
      }
    }

    // Create folder with test user ID
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId,
        userId: testUserId,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
