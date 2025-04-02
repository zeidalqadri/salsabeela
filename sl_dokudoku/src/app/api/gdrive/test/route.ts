import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { GoogleDriveService } from '@/lib/gdrive';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult || !('user' in authResult)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const driveService = GoogleDriveService.getInstance();
    const folderId = '10zMdsrvVst0MBJUIY8R59S4MlJJ0fla2';
    
    const files = await driveService.listFiles(folderId);

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Google Drive test error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 