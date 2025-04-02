'use client'

import { useEffect } from "react"
import { initializeServices } from "../services/initServices"

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize services on mount
    initializeServices()
  }, [])
  
  return <>{children}</>
} 