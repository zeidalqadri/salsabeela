import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/modules/documents/service';
import { getServerSession } from 'next-auth';
import { mkdir } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { PrismaClient } from '@prisma/client';

const documentService = new DocumentService();
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = join(uploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer as unknown as Uint8Array);

    // Get or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      create: {
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      },
      update: {},
    });

    // Create document record
    const document = await documentService.createDocument({
      title,
      description,
      fileUrl: `/uploads/${fileName}`,
      fileType: file.type,
      fileSize: file.size,
      createdById: user.id,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
} 