'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Optionally import React Query DevTools
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use state to ensure QueryClient is only created once per component instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configure default options for queries if needed
        // staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optionally add React Query DevTools for development */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}
