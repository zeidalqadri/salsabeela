'use client'

import { formatDate } from '@/lib/utils' // Assuming formatDate exists and works with ISO strings
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Clock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react'
import { useDocuments } from '@/hooks/useDocuments' // Import the hook
import { Skeleton } from '@/components/ui/skeleton' // Assuming Skeleton component exists

// Removed local RecentDocument interface

interface RecentDocumentsProps {
  // Removed documents prop
  onViewAll?: () => void
  onDocumentClick?: (documentId: string) => void
}

export function RecentDocuments({
  onViewAll,
  onDocumentClick,
}: RecentDocumentsProps) {
  // Destructure the response from useDocuments
  const { data: apiResponse, isLoading, isError, error } = useDocuments()
  const documents = apiResponse?.documents // Access the documents array

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-[200px] text-destructive">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p>Error loading documents:</p>
          <p className="text-sm">{error?.message || 'Unknown error'}</p>
        </div>
      )
    }

    // Check if documents array exists and is not empty
    if (!documents || documents.length === 0) { 
      return (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          <p>No recent documents found.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Map over the documents array */}
        {documents.map((doc) => ( 
          <div
            key={doc.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onDocumentClick?.(doc.id)}
          >
            <div className="flex-shrink-0">
              {/* TODO: Add actual thumbnail logic if available */}
              <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {/* Use title field from DocumentListItem */}
              <h4 className="font-medium truncate">{doc.title}</h4> 
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {/* TODO: Determine document type based on title or API data */}
                <span className="uppercase">{doc.title.split('.').pop() || 'DOC'}</span> 
                <span>•</span>
                {/* Use updatedAt for "last accessed" for now, convert Date to string */}
                <span>{formatDate(doc.updatedAt.toString())}</span> 
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="font-semibold">Recent Documents</h3>
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[300px]">
        {renderContent()}
      </ScrollArea>
    </Card>
  )
}
