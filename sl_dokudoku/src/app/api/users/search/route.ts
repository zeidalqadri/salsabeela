import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(req.url).searchParams
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: {
          id: session.user.id, // Exclude current user
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 5, // Limit results
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 