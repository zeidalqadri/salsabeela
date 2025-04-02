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

interface DocumentGridProps {
  sortBy: string
}

export function DocumentGrid({ sortBy }: DocumentGridProps) {
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
        return <FileText className="h-12 w-12 text-red-500" />
      case "DOCX":
        return <FileText className="h-12 w-12 text-blue-500" />
      case "XLSX":
        return <FileSpreadsheet className="h-12 w-12 text-green-500" />
      case "TXT":
        return <FileCode className="h-12 w-12 text-gray-500" />
      default:
        return <FileText className="h-12 w-12 text-gray-500" />
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedDocuments.map((doc) => (
          <div key={doc.id} className="relative border rounded-lg p-4 flex flex-col hover:bg-muted/30 group">
            <div className="absolute top-2 right-2">
              <Checkbox checked={selectedDocs.includes(doc.id)} onCheckedChange={() => toggleSelectDocument(doc.id)} />
            </div>

            <div className="flex items-center justify-center py-4">{getFileIcon(doc.type)}</div>

            <div className="mt-2 text-center">
              <Link href={`/documents/${doc.id}`} className="font-medium hover:underline line-clamp-2">
                {doc.title}
              </Link>
              <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground mt-1">
                <span>{doc.type}</span>
                <span>•</span>
                <span>{doc.size}</span>
              </div>
              <div className="mt-2 flex justify-center">{getStatusBadge(doc.status)}</div>
            </div>

            <div className="mt-4 pt-2 border-t flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="mr-2 h-4 w-4" />
                    Actions
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
