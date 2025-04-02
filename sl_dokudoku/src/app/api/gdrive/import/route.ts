import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { GoogleDriveService } from '@/lib/gdrive';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (!authResult || !('user' in authResult)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId, parentFolderId } = await req.json();
    
    if (!folderId) {
      return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: authResult.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const driveService = GoogleDriveService.getInstance();
    
    // List all files in the Google Drive folder
    const files = await driveService.listFiles(folderId);
    
    const importedFiles = [];
    
    // Process each file
    for (const file of files || []) {
      try {
        // Skip folders for now - we'll handle them in a separate step
        if (!file.id || !file.name || file.mimeType === 'application/vnd.google-apps.folder') {
          continue;
        }

        // Download file content
        const content = await driveService.downloadFile(file.id);
        
        // Create document in database
        const document = await prisma.document.create({
          data: {
            name: file.name,
            content: content.toString('utf-8'),
            userId: user.id,
            folderId: parentFolderId || null,
            sourceUrl: `https://drive.google.com/file/d/${file.id}/view`,
            metadata: {
              sourceType: 'gdrive',
              sourceId: file.id,
              mimeType: file.mimeType || 'application/octet-stream',
              size: file.size ? parseInt(file.size) : 0,
              createdAt: file.createdTime || new Date().toISOString(),
              modifiedAt: file.modifiedTime || new Date().toISOString(),
            },
          },
        });

        importedFiles.push(document);
      } catch (error) {
        console.error(`Error importing file ${file.name}:`, error);
        // Continue with next file even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: importedFiles.length,
      files: importedFiles,
    });
  } catch (error) {
    console.error('Google Drive import error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 