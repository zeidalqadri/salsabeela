import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

// List of paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/signin", 
  "/auth/signup", 
  "/auth/error", 
  "/api/auth/[...nextauth]",
  "/api/auth/session",
  "/api/healthcheck",
  "/api/documents",
  "/api/documents/[id]/process",
  "/api/documents/[id]/extracted-data",
  "/api/gdrive/import",  // Temporarily added for testing
  "/api/folders",
  "/api/folders/[id]"
]

// List of paths that require admin role
const adminPaths = [
  "/admin",
  "/api/admin",
  "/api/users/manage"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Static assets and images should always be accessible
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get JWT token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Check if it's an API route
  const isApiRoute = pathname.startsWith("/api")

  // Redirect to login if not authenticated
  if (!token) {
    // For API routes, return 401 Unauthorized
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // For other routes, redirect to login
    const loginUrl = new URL("/auth/signin", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check if the path requires admin role
  const isAdminPath = adminPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // User is authenticated but accessing admin path without admin role
  if (isAdminPath && token.role !== "ADMIN") {
    // For API routes, return 403 Forbidden
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // For other routes, redirect to unauthorized page
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  // User is authenticated and authorized, allow access
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|public).*)",
  ],
} 