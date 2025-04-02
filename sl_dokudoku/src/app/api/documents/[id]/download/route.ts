import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { readFile } from "fs/promises"

export async function GET(
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

    // Check if user has access to the document
    const hasAccess = 
      document.userId === session.user.id ||
      document.shares.some(share => share.userId === session.user.id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get the file path from the document
    const filePath = join(process.cwd(), "uploads", document.id)

    try {
      const fileBuffer = await readFile(filePath)
      
      // Set appropriate headers for file download
      const headers = new Headers()
      headers.set("Content-Type", document.fileType || "application/octet-stream")
      headers.set(
        "Content-Disposition",
        `attachment; filename="${document.name}"`
      )
      headers.set("Content-Length", fileBuffer.length.toString())

      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      })
    } catch (error) {
      console.error("Error reading file:", error)
      return NextResponse.json(
        { error: "File not found or inaccessible" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error downloading document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getFileExtension(mimeType: string | null): string {
  if (!mimeType) return ""
  const extensions: Record<string, string> = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    // Add more mime types as needed
  }
  return extensions[mimeType] || ""
} 