import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * API route for handling global search across documents for the authenticated user.
 * In a real implementation, this would:
 * 1. Authenticate the user and check permissions.
 * 2. Get the search query from the request URL parameters.
 * 3. Validate and sanitize the search query.
 * 4. Perform the search across relevant data sources (e.g., document content, metadata in the database).
 * 5. Implement pagination, sorting, and filtering.
 * 6. Return formatted search results or an error.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.document.count({
      where: {
        userId: session.user.id,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return NextResponse.json({
      documents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
