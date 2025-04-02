"use client"

import { useState } from "react"
import { FileText, MoreVertical, Eye, Download, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  title: string
  type: string
  date: string
  entities: string
  status: 'processing' | 'completed' | 'failed'
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Project X123 Technical Specification",
    type: "PDF",
    date: "2023-03-15",
    entities: "42",
    status: "completed"
  },
  {
    id: "2",
    title: "Vendor Agreement - ABC Corporation",
    type: "DOCX",
    date: "2023-03-14",
    entities: "38",
    status: "completed"
  },
  {
    id: "3",
    title: "Financial Report Q1 2023",
    type: "PDF",
    date: "2023-03-12",
    entities: "67",
    status: "completed"
  }
]

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)

  const handleView = (id: string) => {
    // TODO: Implement document viewing
    console.log("View document:", id)
  }

  const handleDownload = (id: string) => {
    // TODO: Implement document download
    console.log("Download document:", id)
  }

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  return (
    <div className="space-y-4">
      {documents.map(doc => (
        <Card key={doc.id}>
          <CardContent className="flex items-center p-4">
            <div className="bg-muted w-10 h-10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • Processed on {doc.date} • {doc.entities} entities
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(doc.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(doc.id)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 