"use client"

import { MainNav } from "@/modules/shared/components/MainNav"
import { UserNav } from "@/modules/shared/components/UserNav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-bold">DokuDoku</h1>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <MainNav />
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 