"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { Document, User, Folder } from '@prisma/client';

interface DocumentWithRelations extends Document {
  createdBy: User;
  folder?: Folder | null;
}

export interface DocumentSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function DocumentSearch({ value, onChange, className }: DocumentSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 300)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
} 