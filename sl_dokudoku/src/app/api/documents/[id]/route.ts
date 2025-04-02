import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed

interface RouteParams {
  params: { id: string };
}

/**
 * API route to get a single document by ID for the authenticated user.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        folder: true,
        tags: true
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Failed to get document' },
      { status: 500 }
    );
  }
}

/**
 * API route to delete a single document by ID for the authenticated user.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: { shares: true }
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user owns the document or has edit permission
    const hasPermission = 
      document.userId === session.user.id ||
      document.shares.some(share => 
        share.userId === session.user.id && 
        share.permission === "EDIT"
      )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.document.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * API route to update a document's details (e.g., title) for the authenticated user.
 * Uses PATCH for partial updates.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: { shares: true }
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user owns the document or has edit permission
    const hasPermission = 
      document.userId === session.user.id ||
      document.shares.some(share => 
        share.userId === session.user.id && 
        share.permission === "EDIT"
      )

    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { name, content, folderId, tagIds } = body

    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(content && { content }),
        ...(folderId !== undefined && { folderId }),
        ...(tagIds && {
          tags: {
            set: tagIds.map((id: string) => ({ id }))
          }
        })
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        folder: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        },
        shares: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
