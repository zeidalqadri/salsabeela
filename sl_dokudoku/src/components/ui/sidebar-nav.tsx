"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface SidebarNavContextValue {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const SidebarNavContext = createContext<SidebarNavContextValue>({
  expanded: true,
  setExpanded: () => {},
})

export function SidebarNavProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <SidebarNavContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarNavContext.Provider>
  )
}

export function useSidebarNav() {
  return useContext(SidebarNavContext)
}

export function SidebarNav({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebarNav()

  return (
    <aside
      className={cn(
        "h-screen",
        expanded ? "w-64" : "w-16",
        "flex flex-col border-r bg-background transition-all duration-200",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarNavHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </div>
  )
}

export function SidebarNavContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      {children}
    </div>
  )
}

export function SidebarNavFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t", className)}>
      {children}
    </div>
  )
}

export function SidebarNavGroup({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2 py-2", className)}>
      {children}
    </div>
  )
}

export function SidebarNavGroupLabel({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebarNav()

  return (
    <div
      className={cn(
        "px-4 py-1 text-xs font-medium uppercase text-muted-foreground",
        !expanded && "sr-only",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarNavGroupContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

export function SidebarNavMenu({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2", className)}>
      {children}
    </div>
  )
}

export function SidebarNavMenuItem({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

interface SidebarNavMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  asChild?: boolean
}

export function SidebarNavMenuButton({
  children,
  className,
  isActive,
  asChild = false,
  ...props
}: SidebarNavMenuButtonProps) {
  const { expanded } = useSidebarNav()
  const Comp = asChild ? "span" : "button"

  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        !expanded && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function SidebarNavSeparator({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-4 my-2 h-px bg-border", className)} />
  )
} 