import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ragClient } from '@/lib/rag-client';
import fs from 'fs';
import { auth as authAuth } from '@/auth';
import { uploadToStorage } from '@/lib/storage';

/**
 * API route to get a list of documents with pagination for the authenticated user.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || undefined;
    const folderId = searchParams.get('folderId');
    const tagIds = searchParams.get('tagIds')?.split(',') || [];
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const shared = searchParams.get('shared');
    const sortField = (searchParams.get('sortField') || 'createdAt') as string;
    const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';

    // Build where clause
    const where = {
      OR: [
        { userId: session.user.id }, // Documents owned by user
        {
          shares: {
            some: {
              userId: session.user.id,
            },
          },
        }, // Documents shared with user
      ],
      AND: [
        // Search in name
        search
          ? {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            }
          : {},
        // Filter by folder
        folderId !== undefined
          ? {
              folderId: folderId === 'null' ? null : folderId,
            }
          : {},
        // Filter by tags
        tagIds.length > 0
          ? {
              tags: {
                some: {
                  id: {
                    in: tagIds,
                  },
                },
              },
            }
          : {},
        // Filter by date range
        startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {},
        // Filter shared documents
        shared === 'true'
          ? {
              shares: {
                some: {},
              },
            }
          : shared === 'false'
          ? {
              shares: {
                none: {},
              },
            }
          : {},
      ],
    };

    // Get total count
    const totalDocuments = await prisma.document.count({
      where,
    });

    // Get paginated documents
    const documents = await prisma.document.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        shares: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      documents,
      totalDocuments,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await authAuth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const folderId = formData.get('folderId') as string | null;

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    // Upload file to storage
    const fileUrl = await uploadToStorage(file);
    const fileType = file.type;
    const fileSize = file.size;

    // Create document in database
    const document = await prisma.document.create({
      data: {
        name: name || file.name,
        fileUrl,
        fileType,
        fileSize,
        userId: session.user.id,
        folderId: folderId || null,
      },
    });

    // Process document with RAG in the background
    try {
      await ragClient.processDocument(document.id, fileUrl, fileType);
    } catch (error) {
      console.error('Failed to process document with RAG:', error);
      // Don't fail the upload if RAG processing fails
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return new NextResponse('Error uploading document', { status: 500 });
  }
}
