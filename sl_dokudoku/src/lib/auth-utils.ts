import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { Session } from "next-auth"

export type AuthResult = Session | NextResponse<{ error: string }>

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return session
}

export async function requireAdmin(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  return session
}

export function isSession(result: AuthResult): result is Session {
  return !('status' in result)
}

export function isError(result: AuthResult): result is NextResponse<{ error: string }> {
  return 'status' in result
}

export function withAuth<T>(handler: (session: Session, ...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T | NextResponse<{ error: string }>> => {
    const auth = await requireAuth()
    if (isError(auth)) {
      return auth
    }
    return handler(auth, ...args)
  }
}

export function withAdmin<T>(handler: (session: Session, ...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T | NextResponse<{ error: string }>> => {
    const auth = await requireAdmin()
    if (isError(auth)) {
      return auth
    }
    return handler(auth, ...args)
  }
} 