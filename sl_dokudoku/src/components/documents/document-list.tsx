import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useDocuments } from "@/hooks/useDocuments"
import type { Document } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Search, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { SortingState, OnChangeFn } from "@tanstack/react-table"
import { DocumentWithRelations } from "@/types/document"

interface UseDocumentsOptions {
  page?: number
  pageSize?: number
  sort?: {
    field: keyof Document
    direction: "asc" | "desc"
  }
  filters?: {
    search?: string
    folderId?: string | null
    tagIds?: string[]
    startDate?: Date
    endDate?: Date
    shared?: boolean
  }
}

export function DocumentList() {
  const [queryParams, setQueryParams] = useState<UseDocumentsOptions>({
    page: 1,
    pageSize: 10,
    sort: {
      field: "updatedAt",
      direction: "desc"
    }
  })
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const debouncedSearch = useDebounce(search, 300)

  const { documents, totalDocuments, isLoading, error } = useDocuments({
    ...queryParams,
    filters: {
      search: debouncedSearch
    }
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setQueryParams(prev => ({ ...prev, page: 1 }))
  }

  const handlePaginationChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }))
  }

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const updatedSorting = typeof updaterOrValue === 'function' 
      ? updaterOrValue(sorting)
      : updaterOrValue

    setSorting(updatedSorting)
    if (updatedSorting.length > 0) {
      setQueryParams(prev => ({
        ...prev,
        sort: {
          field: updatedSorting[0].id as keyof Document,
          direction: updatedSorting[0].desc ? "desc" : "asc"
        }
      }))
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <p>Error: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Manage and search through your document library.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <DataTable<DocumentWithRelations, any>
              columns={columns}
              data={documents.map(doc => ({
                ...doc,
                fileUrl: doc.fileUrl || null,
                versions: doc.versions || []
              }))}
              isLoading={isLoading}
              pagination={{
                pageSize: queryParams.pageSize ?? 10,
                pageIndex: (queryParams.page ?? 1) - 1,
                pageCount: Math.ceil((totalDocuments ?? 0) / (queryParams.pageSize ?? 10)),
                onPageChange: handlePaginationChange
              }}
              sorting={{
                sorting,
                onSortingChange: handleSortingChange
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 