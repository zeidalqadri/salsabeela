import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { requireAuth, isSession } from "@/lib/auth-utils"

const updateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
})

/**
 * API route to delete a single tag by ID. Requires authentication.
 * Note: This only deletes the tag itself. The association with documents
 * is handled by Prisma's relation management based on the schema.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = await requireAuth()
  
  if (!isSession(result)) {
    return result
  }

  try {
    // Check if tag exists and belongs to user
    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
        userId: result.user.id,
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found or access denied" },
        { status: 404 }
      )
    }

    if (tag._count.documents > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag that is still in use" },
        { status: 400 }
      )
    }

    // Delete the tag (this will automatically remove it from all documents due to onDelete: Cascade)
    await prisma.tag.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete tag:", error)
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tags/[id]
 * Update a tag's details
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = await requireAuth()
  
  if (!isSession(result)) {
    return result
  }

  try {
    // Check if tag exists and belongs to user
    const tag = await prisma.tag.findUnique({
      where: {
        id: params.id,
        userId: result.user.id,
      },
    })

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found or access denied" },
        { status: 404 }
      )
    }

    const json = await request.json()
    const body = updateTagSchema.parse(json)

    // If updating name, check for duplicates
    if (body.name) {
      const existingTag = await prisma.tag.findFirst({
        where: {
          userId: result.user.id,
          name: {
            equals: body.name,
            mode: "insensitive",
          },
          id: {
            not: params.id, // Exclude current tag
          },
        },
      })

      if (existingTag) {
        return NextResponse.json(
          { error: "A tag with this name already exists" },
          { status: 400 }
        )
      }
    }

    // Update the tag
    const updatedTag = await prisma.tag.update({
      where: {
        id: params.id,
      },
      data: body,
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Failed to update tag:", error)
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    )
  }
}

// TODO: Add PUT/PATCH route later if tag renaming is needed (consider uniqueness constraints)
