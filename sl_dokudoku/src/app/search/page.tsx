'use client'

import { useSearchParams } from 'next/navigation'
import { useSearch, SearchResultItem } from '@/hooks/useSearch' // Import SearchResultItem
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' // Import useRouter for pagination

// Basic component to display a single search result
function SearchResultItemDisplay({ item }: { item: SearchResultItem }) { // Use SearchResultItem type
  const getLinkHref = (item: SearchResultItem): string => {
    switch (item.type) {
      case 'document':
        return `/documents/${item.id}`;
      // Add cases for other types like 'folder', 'user' if needed
      // case 'folder':
      //   return `/folders/${item.id}`; 
      default:
        return '#'; // Default or fallback link
    }
  }

  return (
    <div className="border-b py-4">
      <Link href={getLinkHref(item)}>
        <h3 className="text-lg font-semibold text-primary hover:underline">{item.title}</h3>
      </Link>
      {/* Display snippet or other info later */}
      <p className="text-sm text-muted-foreground mt-1">Type: {item.type} | ID: {item.id}</p>
      {item.createdAt && (
         <p className="text-xs text-muted-foreground">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  const router = useRouter() // Initialize router
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  // Use the search hook
  const { data: apiResponse, isLoading, isError, error } = useSearch(query, page)

  const results = apiResponse?.results
  const pagination = apiResponse?.pagination

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-4 border-b">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-destructive">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p>Error loading search results:</p>
          <p className="text-sm">{error?.message || 'Unknown error'}</p>
        </div>
      )
    }

    if (!results || results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <FileText className="w-10 h-10 mb-4" />
          <p>No results found for "{query}".</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {results.map((item) => (
          <SearchResultItemDisplay key={item.id} item={item} />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      {renderContent()}

      {/* Basic Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button 
            variant="outline" 
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => router.push(`/search?q=${encodeURIComponent(query)}&page=${pagination.currentPage - 1}`)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalCount} results)
          </span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => router.push(`/search?q=${encodeURIComponent(query)}&page=${pagination.currentPage + 1}`)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
