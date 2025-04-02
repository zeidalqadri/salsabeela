import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UseAuthOptions {
  redirectTo?: string
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    redirectTo = '/auth/signin',
    requireAuth = true,
    requireAdmin = false,
  } = options

  useEffect(() => {
    if (status === 'loading') return

    const isAuthenticated = !!session?.user
    const isAdmin = session?.user?.role === 'ADMIN'

    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push('/unauthorized')
      return
    }
  }, [session, status, router, redirectTo, requireAuth, requireAdmin])

  return {
    session,
    status,
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === 'ADMIN',
    isLoading: status === 'loading',
  }
} 