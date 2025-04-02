'use client';

import { SessionProvider } from "next-auth/react"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
} 