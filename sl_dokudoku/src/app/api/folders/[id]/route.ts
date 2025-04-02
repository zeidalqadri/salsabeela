"use client";

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for folder update
const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  parentId: z.string().nullable().optional(),
})

interface FolderParent {
  parentId: string | null;
}

/**
 * PATCH /api/folders/[id] - Update a folder
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = params.id
    
    // Check if folder exists and belongs to user
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      )
    }

    // Validate request body
    const body = await request.json()
    const result = UpdateFolderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { name, parentId } = result.data

    // If parentId is provided, verify it exists and belongs to user
    if (parentId) {
      // Prevent setting parent to self
      if (parentId === folderId) {
        return NextResponse.json(
          { error: "Cannot set folder as its own parent" },
          { status: 400 }
        )
      }

      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: parentId,
          userId: session.user.id,
        },
      })

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        )
      }

      // Check for circular references
      let currentParentId: string | null = parentId;
      while (currentParentId) {
        const parent = await prisma.folder.findUnique({
          where: { id: currentParentId },
          select: { parentId: true },
        }) as FolderParent | null;

        if (!parent) break;
        if (parent.parentId === folderId) {
          return NextResponse.json(
            { error: "Cannot create circular folder structure" },
            { status: 400 }
          );
        }
        currentParentId = parent.parentId;
      }
    }

    // Update folder
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
        parentId,
      },
    })

    return NextResponse.json(updatedFolder)
  } catch (error) {
    console.error("Error updating folder:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/folders/[id] - Delete a folder
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = params.id
    
    // Check if folder exists and belongs to user
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            documents: true,
            children: true,
          },
        },
      },
    })

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      )
    }

    // Check if folder has documents or subfolders
    if (folder._count.documents > 0 || folder._count.children > 0) {
      return NextResponse.json(
        { error: "Cannot delete folder with documents or subfolders" },
        { status: 400 }
      )
    }

    // Delete folder
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
