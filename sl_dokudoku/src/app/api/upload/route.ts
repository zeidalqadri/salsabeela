import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ExtractedDatum } from "@/lib/extractionSchemas";

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "image/jpeg",
  "image/png",
] as const;

// Type for allowed file types
type AllowedFileType = typeof ALLOWED_FILE_TYPES[number];

// Validation schema
const UploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  ).refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType),
    "Unsupported file type"
  ),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const gdriveUrl = formData.get("gdriveUrl") as string | null;

    if (!file && !gdriveUrl) {
      return NextResponse.json(
        { error: "No file or Google Drive URL provided" },
        { status: 400 }
      );
    }

    let content: string;
    let fileName: string;

    if (file) {
      // Handle local file upload
      fileName = file.name;
      content = await extractTextFromFile(file);
    } else if (gdriveUrl) {
      // Handle Google Drive file
      const { fileName: gdriveFileName, content: gdriveContent } = await downloadFromGoogleDrive(gdriveUrl);
      fileName = gdriveFileName;
      content = gdriveContent;
    } else {
      return NextResponse.json(
        { error: "Invalid file or Google Drive URL" },
        { status: 400 }
      );
    }

    // Use LLM to extract structured data
    const extractedData = await extractBusinessWorthyInfo(content);

    // Generate mock file URL (in production, use a real storage service)
    const fileUrl = `https://storage.example.com/documents/${session.user.id}/${fileName}`;

    // Create document in database
    const document = await prisma.document.create({
      data: {
        name: fileName,
        fileUrl: fileUrl,
        fileType: file?.type || "application/octet-stream",
        fileSize: file?.size || 0,
        userId: session.user.id,
        extractedData: {
          create: extractedData,
        },
      },
      include: { extractedData: true },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        fileUrl: document.fileUrl,
        fileType: document.fileType,
        fileSize: document.fileSize,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("[Upload Error]", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

/**
 * Process the document and extract information
 * This runs asynchronously after the upload response is sent
 */
async function processDocumentAsync(
  documentId: string,
  fileUrl: string,
  fileType: string
): Promise<void> {
  try {
    console.log(`Processing document ${documentId}`);

    // In a real implementation, this would call an extraction service
    // For now, we'll just create some basic metadata entries
    
    // Extract basic metadata
    const extractedData = [
      {
        documentId,
        category: "Metadata",
        label: "File Type",
        value: fileType,
      },
      {
        documentId,
        category: "Content",
        label: "Source URL",
        value: fileUrl,
      },
    ];
    
    // Store the extracted data
    await prisma.$transaction(
      extractedData.map(data => 
        prisma.extractedDatum.create({
          data: {
            documentId: data.documentId,
            category: data.category,
            label: data.label,
            value: data.value,
            context: null,
            confidence: 1.0,
          },
        })
      )
    );
    
    console.log(`Completed processing for document ${documentId}`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    // Handle the error but don't throw it since this runs asynchronously
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  // Implementation of extractTextFromFile function
  // This is a placeholder and should be replaced with the actual implementation
  // based on the file type and content extraction logic
  return "Extracted text from the file";
}

async function extractBusinessWorthyInfo(content: string): Promise<ExtractedDatum[]> {
  // Use OpenAI API to extract structured data
  const prompt = `Extract business-worthy information from the following text. Return a JSON array of objects with the following structure: { type: "actionItem" | "keyDate" | "financialFigure" | "risk" | "clientMention", content: string, metadata?: { ... } }`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Helper function to download from Google Drive
async function downloadFromGoogleDrive(url: string): Promise<{ fileName: string; content: string }> {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) {
    throw new Error("Invalid Google Drive URL");
  }

  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download file from Google Drive");
  }

  const content = await response.text();
  const fileName = await getGoogleDriveFileName(fileId);

  return { fileName, content };
}

// Helper function to extract file ID from Google Drive URL
function extractGoogleDriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([^\/]+)/);
  return match ? match[1] : null;
}

// Helper function to get file name from Google Drive
async function getGoogleDriveFileName(fileId: string): Promise<string> {
  const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const response = await fetch(metadataUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch file metadata from Google Drive");
  }

  const metadata = await response.json();
  return metadata.name;
} 