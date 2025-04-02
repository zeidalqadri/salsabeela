"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, FileSpreadsheet, FileCode, MoreHorizontal, Download, Trash, Eye, Edit, Share2 } from "lucide-react"
import Link from "next/link"

interface DocumentListProps {
  sortBy: string
}

export function DocumentList({ sortBy }: DocumentListProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [documents, setDocuments] = useState<{ id: string; title: string; type: string; size: string; date: string; source: string; status: string; entities: number }[]>([])

  useEffect(() => {
    // Fetch documents from the backend
    const fetchDocuments = async () => {
      const response = await fetch('/api/documents')
      const data = await response.json()
      setDocuments(data)
    }
    fetchDocuments()
  }, [])

  // Sort documents based on sortBy value
  const sortedDocuments = [...documents].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "name-asc":
        return a.title.localeCompare(b.title)
      case "name-desc":
        return b.title.localeCompare(a.title)
      case "type":
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  const toggleSelectDocument = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((docId) => docId !== id))
    } else {
      setSelectedDocs([...selectedDocs, id])
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "DOCX":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "XLSX":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case "TXT":
        return <FileCode className="h-5 w-5 text-gray-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "Processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "Queued":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Queued</Badge>
      case "Error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {selectedDocs.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">{selectedDocs.length} document(s) selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
          <div className="col-span-1">
            <Checkbox
              checked={selectedDocs.length === documents.length && documents.length > 0}
              onCheckedChange={(e) => {
                if (e.target.checked) {
                  setSelectedDocs(documents.map((doc) => doc.id))
                } else {
                  setSelectedDocs([])
                }
              }}
            />
          </div>
          <div className="col-span-5">Document</div>
          <div className="col-span-2 hidden md:block">Source</div>
          <div className="col-span-1 hidden md:block">Size</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {sortedDocuments.map((doc) => (
          <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-muted/30">
            <div className="col-span-1">
              <Checkbox checked={selectedDocs.includes(doc.id)} onCheckedChange={() => toggleSelectDocument(doc.id)} />
            </div>
            <div className="col-span-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getFileIcon(doc.type)}</div>
                <div>
                  <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                    {doc.title}
                  </Link>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{new Date(doc.date).toLocaleDateString()}</span>
                    {doc.status === "Completed" && (
                      <>
                        <span>•</span>
                        <span>{doc.entities} entities</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 hidden md:block text-sm text-muted-foreground">{doc.source}</div>
            <div className="col-span-1 hidden md:block text-sm text-muted-foreground">{doc.size}</div>
            <div className="col-span-2">{getStatusBadge(doc.status)}</div>
            <div className="col-span-1 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/documents/${doc.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Metadata
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
