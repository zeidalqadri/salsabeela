import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ComponentType, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface WithAuthProps {
  [key: string]: any
}

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options: {
    requireAuth?: boolean
    requireAdmin?: boolean
    redirectTo?: string
  } = {}
) {
  return function WithAuthComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const {
      requireAuth = true,
      requireAdmin = false,
      redirectTo = "/auth/signin",
    } = options

    useEffect(() => {
      if (status === "loading") return

      const isAuthenticated = !!session?.user
      const isAdmin = session?.user?.role === "ADMIN"

      if (requireAuth && !isAuthenticated) {
        router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push("/unauthorized")
        return
      }
    }, [session, status, router, requireAuth, requireAdmin, redirectTo])

    if (status === "loading") {
      return (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    if (requireAuth && !session?.user) {
      return null
    }

    if (requireAdmin && session?.user?.role !== "ADMIN") {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 