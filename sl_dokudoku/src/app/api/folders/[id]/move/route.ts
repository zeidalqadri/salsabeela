import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema for moving a folder
const MoveFolderSchema = z.object({
  parentId: z.string().nullable(),
});

/**
 * Helper function to check if a folder is a descendant of another folder
 */
async function isFolderDescendant(ancestorId: string, folderId: string): Promise<boolean> {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { parentId: true },
  });

  if (!folder || !folder.parentId) {
    return false;
  }

  if (folder.parentId === ancestorId) {
    return true;
  }

  return isFolderDescendant(ancestorId, folder.parentId);
}

/**
 * PATCH /api/folders/[id]/move - Move a folder to a new parent
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const folderId = params.id;
    
    // Check if folder exists and belongs to the user
    const existingFolder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    const json = await request.json();
    const result = MoveFolderSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { parentId } = result.data;

    // Cannot move a folder to itself
    if (parentId === folderId) {
      return NextResponse.json(
        { error: "Cannot move a folder to itself" },
        { status: 400 }
      );
    }

    // If parentId is provided, verify it exists and belongs to the user
    if (parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: {
          id: parentId,
          userId: session.user.id,
        },
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
      }

      // Check if the target parent is a descendant of the folder being moved
      // This would create a circular reference
      const isDescendant = await isFolderDescendant(folderId, parentId);
      if (isDescendant) {
        return NextResponse.json(
          { error: "Cannot move a folder to its own descendant" },
          { status: 400 }
        );
      }
    }

    // Move the folder
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        parentId,
      },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error("[Move Folder API Error]", error);
    return NextResponse.json(
      { error: "Failed to move folder" },
      { status: 500 }
    );
  }
} 