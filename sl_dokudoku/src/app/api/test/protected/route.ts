import { NextResponse } from "next/server"
import { requireAuth, requireOwnership, isSession } from "@/lib/auth-utils"

export async function GET() {
  const result = await requireAuth()
  
  if (!isSession(result)) {
    return result // Will be NextResponse with 401
  }

  return NextResponse.json({
    message: "This is a protected endpoint",
    user: {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role
    }
  })
}

export async function POST() {
  const result = await requireAuth()
  
  if (!isSession(result)) {
    return result // Will be NextResponse with 401
  }

  // Example of checking ownership
  const testUserId = "some-user-id"
  const ownershipResult = await requireOwnership(testUserId)
  
  if (!isSession(ownershipResult)) {
    return ownershipResult // Will be NextResponse with 401 or 403
  }

  return NextResponse.json({
    message: "You have permission to modify this resource",
    user: {
      id: ownershipResult.user.id,
      email: ownershipResult.user.email,
      role: ownershipResult.user.role
    }
  })
} 