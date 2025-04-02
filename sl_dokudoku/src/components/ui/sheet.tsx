"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

interface SheetTriggerProps {
  onClick: () => void
  children: React.ReactNode
  asChild?: boolean
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ isOpen, onClose, children }, ref) => {
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="fixed right-0 top-0 h-full w-3/4 max-w-sm border-l bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  }
)
Sheet.displayName = "Sheet"

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ onClick, children, asChild }, ref) => {
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        onClick,
        ref,
      })
    }

    return (
      <button ref={ref} onClick={onClick}>
        {children}
      </button>
    )
  }
)
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("relative h-full", className)}>
        {children}
      </div>
    )
  }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      >
        {children}
      </div>
    )
  }
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ children, className }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-lg font-semibold text-foreground",
          className
        )}
      >
        {children}
      </h2>
    )
  }
)
SheetTitle.displayName = "SheetTitle"

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
}
