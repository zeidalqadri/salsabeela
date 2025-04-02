import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PermissionLevel } from '@prisma/client'; // Correct: Import enum directly
import { getServerSession } from "next-auth/next"; // Import for DELETE
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import for DELETE

/**
 * API route to get permissions for a specific document. Requires authentication.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const requestingUserId = session.user.id; // ID of user making the request

  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ error: 'documentId query parameter is required' }, { status: 400 });
  }

  console.log(`Fetching permissions for document: ${documentId} (requested by ${requestingUserId})`);

  try {
    // Verify user has permission to view permissions for this document (e.g., owner or EDIT access)
    // TODO: Implement checkUserAccess function or similar logic
    // For now, allow any logged-in user to view permissions (adjust later based on requirements)
    // const hasAccess = await checkUserAccess(requestingUserId, documentId, PermissionLevel.VIEW); 
    // if (!hasAccess) return NextResponse.json({ error: 'Permission denied to view permissions' }, { status: 403 });

    const permissions = await prisma.documentPermission.findMany({
      where: { documentId: documentId },
      include: { 
        user: { // Include user details (e.g., email, name)
          select: { id: true, email: true, name: true, image: true } 
        } 
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(permissions);

  } catch (error) {
    console.error(`Error fetching permissions for document ${documentId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching permissions.';
    return NextResponse.json({ error: 'Failed to fetch permissions.', details: errorMessage }, { status: 500 });
  }
}


/**
 * API route to add or update a user's permission for a document. Requires authentication.
 * Uses POST, but acts like an upsert based on unique constraint (documentId, userId).
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const requestingUserId = session.user.id; // ID of user granting permission

  try {
    const body = await request.json();
    // TODO: Use Zod for validation
    const { documentId, targetUserId, level } = body;

    if (!documentId || !targetUserId || !level) {
      return NextResponse.json({ error: 'Invalid input: documentId, targetUserId, and level are required.' }, { status: 400 });
    }

    // Validate permission level
    if (!Object.values(PermissionLevel).includes(level)) { // Validate against the enum values
       return NextResponse.json({ error: 'Invalid permission level provided.' }, { status: 400 });
    }
    const validLevel = level as PermissionLevel; // Cast to the enum type

    console.log(`User ${requestingUserId} setting permission for user ${targetUserId} on document ${documentId} to ${level}`);

    // Verify the requesting user has permission to share this document (e.g., owner or EDIT access)
    // TODO: Implement checkUserAccess function or similar logic
    // For now, assume only owner can share (adjust later)
    const documentOwner = await prisma.document.findUnique({
      where: { id: documentId },
      select: { userId: true }
    });
    if (!documentOwner || documentOwner.userId !== requestingUserId) {
       return NextResponse.json({ error: 'Permission denied: Only the document owner can share.' }, { status: 403 });
    }
    
    // TODO: Verify targetUserId exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }});
    if (!targetUser) {
       return NextResponse.json({ error: 'Target user not found.' }, { status: 404 });
    }
    
    // Prevent sharing with oneself
    if (targetUserId === requestingUserId) {
       return NextResponse.json({ error: 'Cannot share document with yourself.' }, { status: 400 });
    }

    // Upsert the permission (create or update)
    const permission = await prisma.documentPermission.upsert({
      where: {
        documentId_userId: { // Use the unique constraint name
          documentId: documentId,
          userId: targetUserId,
        },
      },
      update: {
        level: validLevel, // Use validated enum value
      },
      create: {
        documentId: documentId,
        userId: targetUserId,
        level: validLevel, // Use validated enum value
      },
    });

    console.log('Permission set:', permission.id);
    return NextResponse.json(permission, { status: 200 }); // Return 200 OK for upsert

  } catch (error: any) {
    console.error('Error setting permission:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error setting permission.';
    return NextResponse.json({ error: 'Failed to set permission.', details: errorMessage }, { status: 500 });
  }
}

/**
 * API route to remove a specific permission entry by its ID.
 */
export async function DELETE(request: Request) {
  // Add session check
  const session = await getServerSession(authOptions); 
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const requestingUserId = session.user.id;

  const { searchParams } = new URL(request.url);
  const permissionId = searchParams.get('permissionId');

  if (!permissionId) {
    return NextResponse.json({ error: 'permissionId query parameter is required' }, { status: 400 });
  }

  console.log(`Attempting to delete permission ${permissionId}`);

  try {
    // Find the permission to get the document ID and verify ownership
    const permission = await prisma.documentPermission.findUnique({
      where: { id: permissionId },
      select: { 
        document: { 
          select: { userId: true } // Get the owner ID of the document
        },
        userId: true // Get the ID of the user whose permission is being removed
      } 
    });

    if (!permission) {
      return NextResponse.json({ error: 'Permission record not found' }, { status: 404 });
    }

    // Check if the requesting user is the document owner
    // TODO: Allow users with EDIT permission to remove others' VIEW permission? (More complex logic)
    if (permission.document.userId !== requestingUserId) {
       return NextResponse.json({ error: 'Permission denied: Only the document owner can remove permissions.' }, { status: 403 });
    }
    
    // Prevent owner from removing their own implicit permission (though this shouldn't exist as a record)
    if (permission.userId === requestingUserId) {
       return NextResponse.json({ error: 'Cannot remove owner permission.' }, { status: 400 });
    }

    // Delete the permission record
    await prisma.documentPermission.delete({
      where: { id: permissionId },
    });

    console.log(`Deleted permission ${permissionId}`);
    return NextResponse.json({ success: true, message: 'Permission removed successfully.' });

  } catch (error: any) {
    console.error(`Error deleting permission ${permissionId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error removing permission.';
    return NextResponse.json({ error: 'Failed to remove permission.', details: errorMessage }, { status: 500 });
  }
}
