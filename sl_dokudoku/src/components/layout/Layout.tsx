'use client'

import { Sidebar } from './Sidebar'
import { UserNav } from './UserNav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 