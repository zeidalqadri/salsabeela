"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

  // Mock document data
  const documents = [
    {
      id: "doc-001",
      title: "Project X123 Technical Specification",
      type: "PDF",
      size: "2.4 MB",
      date: "2023-03-15",
      source: "Google Drive",
      status: "Completed",
      entities: 42,
    },
    {
      id: "doc-002",
      title: "Vendor Agreement - ABC Corporation",
      type: "DOCX",
      size: "1.8 MB",
      date: "2023-03-14",
      source: "Manual Upload",
      status: "Completed",
      entities: 38,
    },
    {
      id: "doc-003",
      title: "Financial Report Q1 2023",
      type: "PDF",
      size: "3.2 MB",
      date: "2023-03-12",
      source: "SharePoint",
      status: "Completed",
      entities: 67,
    },
    {
      id: "doc-004",
      title: "Meeting Minutes - Project Planning",
      type: "DOCX",
      size: "1.1 MB",
      date: "2023-03-10",
      source: "Manual Upload",
      status: "Completed",
      entities: 24,
    },
    {
      id: "doc-005",
      title: "Client Requirements Document",
      type: "PDF",
      size: "2.7 MB",
      date: "2023-03-08",
      source: "Google Drive",
      status: "Completed",
      entities: 51,
    },
  ]

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

  const toggleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(documents.map((doc) => doc.id))
    }
  }

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
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "Processing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "Queued":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Queued</Badge>
      case "Error":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="grid grid-cols-[25px_1fr_100px_100px_100px_100px_50px] gap-3 p-4 bg-muted">
          <div>
            <Checkbox
              checked={selectedDocs.length === documents.length}
              onCheckedChange={toggleSelectAll}
            />
          </div>
          <div className="font-medium">Document</div>
          <div className="font-medium">Type</div>
          <div className="font-medium">Size</div>
          <div className="font-medium">Status</div>
          <div className="font-medium">Entities</div>
          <div></div>
        </div>

        <div className="divide-y">
          {sortedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-[25px_1fr_100px_100px_100px_100px_50px] gap-3 p-4 items-center hover:bg-muted/50"
            >
              <div>
                <Checkbox
                  checked={selectedDocs.includes(doc.id)}
                  onCheckedChange={() => toggleSelectDocument(doc.id)}
                />
              </div>
              <div className="flex items-center gap-2">
                {getFileIcon(doc.type)}
                <span className="font-medium">{doc.title}</span>
              </div>
              <div>{doc.type}</div>
              <div>{doc.size}</div>
              <div>{getStatusBadge(doc.status)}</div>
              <div>{doc.entities}</div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
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
    </div>
  )
} 