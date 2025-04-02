import { useState, useEffect } from "react" // Add useEffect
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Pencil,
  Share,
  Trash,
  Share2,
  FolderInput, // Placeholder for Move icon
  Tag, // Placeholder for Tag icon
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useDocuments } from "@/hooks/useDocuments"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { useRBAC } from "@/hooks/useRBAC"
import { ShareDialog } from "./share-dialog"

interface DocumentTableProps {
  page: number
  pageSize: number
  search?: string
  folderId?: string | null
  tagIds?: string[]
  startDate?: Date
  endDate?: Date
  shared?: boolean
  onPageChange: (page: number) => void
  onDocumentSelect: (documentId: string) => void
  onDocumentDelete: (documentId: string) => void
  onDocumentShare: (documentId: string) => void
  onDocumentDownload: (documentId: string) => void
  // Add props for batch actions later
}

export function DocumentTable({
  page,
  pageSize,
  search,
  folderId,
  tagIds,
  startDate,
  endDate,
  shared,
  onPageChange,
  onDocumentSelect,
  onDocumentDelete,
  onDocumentShare,
  onDocumentDownload,
}: DocumentTableProps) {
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({}) // State for selection
  // const { can } = useRBAC() // Temporarily comment out RBAC

  // Clear selection when data changes (e.g., page change, filter change)
  useEffect(() => {
    setSelectedRowIds({});
  }, [page, pageSize, search, folderId, tagIds, startDate, endDate, shared]);


  const {
    documents,
    totalDocuments,
    totalPages,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
  } = useDocuments({
    page,
    pageSize,
    sort: {
      field: sortField as any,
      direction: sortDirection,
    },
    filters: {
      search,
      folderId,
      tagIds,
      startDate,
      endDate,
      shared,
    },
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Error loading documents
      </div>
    )
  }

  const selectedCount = Object.values(selectedRowIds).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Batch Action Toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-md border">
           <span className="text-sm text-muted-foreground">{selectedCount} item(s) selected</span>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => console.log('Batch Move:', Object.keys(selectedRowIds).filter(id => selectedRowIds[id]))}>
               <FolderInput className="mr-2 h-4 w-4" /> {/* Use appropriate icon */}
               Move
             </Button>
             <Button variant="outline" size="sm" onClick={() => console.log('Batch Tag:', Object.keys(selectedRowIds).filter(id => selectedRowIds[id]))}>
               <Tag className="mr-2 h-4 w-4" /> {/* Use appropriate icon */}
               Tag
             </Button>
             {/* Add Batch Delete later if needed */}
           </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Select All Checkbox */}
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    documents.length > 0 &&
                    Object.keys(selectedRowIds).length === documents.length &&
                    documents.every(doc => selectedRowIds[doc.id])
                  }
                  onCheckedChange={(checked) => {
                    const newSelectedRowIds: Record<string, boolean> = {};
                    if (checked) {
                      documents.forEach(doc => newSelectedRowIds[doc.id] = true);
                    }
                    setSelectedRowIds(newSelectedRowIds);
                  }}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1"
                >
                  Created
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Shared</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow 
                key={document.id} 
                data-state={selectedRowIds[document.id] ? "selected" : ""} // For potential styling
              >
                {/* Row Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={selectedRowIds[document.id] || false}
                    onCheckedChange={(checked) => {
                      setSelectedRowIds(prev => ({
                        ...prev,
                        [document.id]: !!checked,
                      }));
                    }}
                    aria-label={`Select row ${document.name}`}
                  />
                </TableCell>
                <TableCell
                  className="cursor-pointer font-medium hover:underline"
                  onClick={() => onDocumentSelect(document.id)} // Keep row click for details view
                >
                  {document.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {/* Access nested tag object */}
                    {document.tags.map((docTag) => ( 
                      <span
                        key={docTag.tag.id} // Use docTag.tag.id
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                      >
                        {docTag.tag.name} {/* Use docTag.tag.name */}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {document.folder?.name || <span className="text-muted-foreground">No folder</span>}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(document.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>{document._count.comments}</TableCell>
                <TableCell>
                  {document.shares.length > 0 ? (
                    <span className="text-primary">
                      Shared ({document.shares.length})
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Private</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ShareDialog
                      documentId={document.id}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* {can.update() && ( // Temporarily comment out RBAC check */}
                          <DropdownMenuItem
                            onClick={() => onDocumentSelect(document.id)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        {/* )} */}
                        {/* {can.share() && ( // Temporarily comment out RBAC check */}
                          <DropdownMenuItem
                            onClick={() => onDocumentShare(document.id)}
                          >
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        {/* )} */}
                        <DropdownMenuItem
                          onClick={() => onDocumentDownload(document.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        {/* {can.delete() && ( // Temporarily comment out RBAC check */}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDocumentDelete(document.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        {/* )} */} {/* Correctly commented out */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8} // Increased colspan due to checkbox column
                  className="h-24 text-center text-muted-foreground"
                >
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {totalDocuments} document{totalDocuments === 1 ? "" : "s"} total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
