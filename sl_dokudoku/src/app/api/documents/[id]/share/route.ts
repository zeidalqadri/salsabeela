import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (document.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId, permission } = await req.json()

    if (!userId || !permission) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["VIEW", "EDIT"].includes(permission)) {
      return NextResponse.json(
        { error: "Invalid permission" },
        { status: 400 }
      )
    }

    // Check if share already exists
    const existingShare = await prisma.documentShare.findUnique({
      where: {
        documentId_userId: {
          documentId: params.id,
          userId,
        },
      },
    })

    let share
    if (existingShare) {
      // Update existing share
      share = await prisma.documentShare.update({
        where: {
          id: existingShare.id,
        },
        data: {
          permission,
        },
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
      })
    } else {
      // Create new share
      share = await prisma.documentShare.create({
        data: {
          documentId: params.id,
          userId,
          permission,
        },
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
      })
    }

    return NextResponse.json(share)
  } catch (error) {
    console.error("Error sharing document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

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

    if (document.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { shareId } = await req.json()

    const share = await prisma.documentShare.findUnique({
      where: { id: shareId },
    })

    if (!share || share.documentId !== params.id) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 })
    }

    await prisma.documentShare.delete({
      where: { id: shareId },
    })

    return NextResponse.json({
      success: true,
      message: "Share removed successfully",
    })
  } catch (error) {
    console.error("Error removing share:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 