import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Document, User, Tag } from '@prisma/client'
import { toast } from 'sonner'
import { useCallback } from "react"
import { DocumentWithRelations, DocumentsResponse } from "@/types/document"

interface SortConfig {
  field: keyof Document
  direction: "asc" | "desc"
}

interface FilterConfig {
  search?: string
  folderId?: string | null
  tagIds?: string[]
  startDate?: Date
  endDate?: Date
  shared?: boolean
}

interface UseDocumentsOptions {
  page?: number
  pageSize?: number
  sort?: SortConfig
  filters?: FilterConfig
}

const defaultOptions: UseDocumentsOptions = {
  page: 1,
  pageSize: 10,
  sort: {
    field: "createdAt",
    direction: "desc",
  },
}

async function getDocuments(
  options: UseDocumentsOptions = defaultOptions
): Promise<DocumentsResponse> {
  const searchParams = new URLSearchParams()

  // Pagination
  if (options.page) {
    searchParams.set("page", options.page.toString())
  }
  if (options.pageSize) {
    searchParams.set("pageSize", options.pageSize.toString())
  }

  // Sorting
  if (options.sort) {
    searchParams.set("sortField", options.sort.field)
    searchParams.set("sortDirection", options.sort.direction)
  }

  // Filtering
  if (options.filters) {
    const { search, folderId, tagIds, startDate, endDate, shared } = options.filters

    if (search) {
      searchParams.set("search", search)
    }
    if (folderId !== undefined) {
      searchParams.set("folderId", folderId || "null")
    }
    if (tagIds?.length) {
      searchParams.set("tagIds", tagIds.join(","))
    }
    if (startDate) {
      searchParams.set("startDate", startDate.toISOString())
    }
    if (endDate) {
      searchParams.set("endDate", endDate.toISOString())
    }
    if (shared !== undefined) {
      searchParams.set("shared", shared.toString())
    }
  }

  const response = await fetch(`/api/documents?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch documents")
  }

  return response.json()
}

export function useDocuments(options: UseDocumentsOptions = defaultOptions) {
  const queryKey = ["documents", options]

  const query = useQuery<DocumentsResponse, Error>({
    queryKey,
    queryFn: () => getDocuments(options),
    placeholderData: (previousData) => previousData,
  })

  const { data, isLoading, error } = query

  const documents = data?.documents || []
  const totalDocuments = data?.totalCount || 0
  const totalPages = Math.ceil(totalDocuments / (options.pageSize || 10))

  const hasNextPage = options.page ? options.page < totalPages : false
  const hasPreviousPage = options.page ? options.page > 1 : false

  return {
    documents,
    totalDocuments,
    totalPages,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
  }
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (document: { 
      id: string
      name?: string
      folderId?: string | null
      tagIds?: string[]
      content?: string
    }) => {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update document')
      }
      
      return response.json()
    },
    onSuccess: (updatedDoc) => {
      queryClient.setQueryData(['document', updatedDoc.id], updatedDoc)
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      console.error('Document update error:', error)
    }
  })
}
