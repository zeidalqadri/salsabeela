"use client"

import { withAuth } from '@/components/auth/with-auth'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">Welcome, {session?.user.name || 'User'}!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Total documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Organize with tags</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Total tags</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shared</CardTitle>
            <CardDescription>Documents shared with you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Shared documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage) 