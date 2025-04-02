"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface SearchFilters {
  type: string[]
  dateRange: string
  source: string[]
}

export function DocumentSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: "all",
    source: []
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const documentTypes = ["PDF", "DOCX", "TXT", "XLS"]
  const documentSources = ["Google Drive", "SharePoint", "Local", "Email"]
  const dateRanges = [
    { label: "All time", value: "all" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" }
  ]

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search:", searchQuery, filters)
  }

  const toggleFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      if (type === "dateRange") {
        return { ...prev, [type]: value }
      }
      
      const array = prev[type] as string[]
      const newArray = array.includes(value)
        ? array.filter(v => v !== value)
        : [...array, value]
      
      return { ...prev, [type]: newArray }
    })

    updateActiveFilters()
  }

  const updateActiveFilters = () => {
    const active: string[] = []
    if (filters.type.length) active.push(`${filters.type.length} types`)
    if (filters.source.length) active.push(`${filters.source.length} sources`)
    if (filters.dateRange !== "all") active.push("Date range")
    setActiveFilters(active)
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      dateRange: "all",
      source: []
    })
    setActiveFilters([])
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="font-medium mb-2">Document Type</h3>
                <div className="space-y-2">
                  {documentTypes.map(type => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={() => toggleFilter("type", type)}
                        className="rounded border-gray-300"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Date Range</h3>
                <div className="space-y-2">
                  {dateRanges.map(range => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="dateRange"
                        value={range.value}
                        checked={filters.dateRange === range.value}
                        onChange={() => toggleFilter("dateRange", range.value)}
                        className="rounded border-gray-300"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Document Source</h3>
                <div className="space-y-2">
                  {documentSources.map(source => (
                    <label
                      key={source}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters.source.includes(source)}
                        onChange={() => toggleFilter("source", source)}
                        className="rounded border-gray-300"
                      />
                      {source}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </form>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map(filter => (
            <div
              key={filter}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs"
            >
              {filter}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
} 