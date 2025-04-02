'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification link is no longer valid. It may have expired or already been used.'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return 'There was a problem signing you in. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.'
      case 'EmailSignin':
        return 'The e-mail could not be sent. Please try again.'
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try signing in again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 