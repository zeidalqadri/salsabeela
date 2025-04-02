"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DocumentViewer } from "@/components/document-viewer"
import { EntityList } from "@/components/entity-list"
import { DocumentMetadata } from "@/components/document-metadata"
import { DocumentHistory } from "@/components/document-history"
import { ArrowLeft, Download, Share2, Edit, Trash, FileText } from "lucide-react"
import Link from "next/link"

export default function DocumentDetailPage() {
  const params = useParams()
  const documentId = params.id as string
  const [activeTab, setActiveTab] = useState("preview")

  // Mock document data
  const document = {
    id: documentId,
    title: "Project X123 Technical Specification",
    type: "PDF",
    size: "2.4 MB",
    date: "2023-03-15",
    source: "Google Drive",
    status: "Completed",
    entities: 42,
    pages: 24,
    language: "English",
    author: "John Smith",
    lastModified: "2023-03-10",
    description:
      "Technical specifications for Project X123 including system architecture, requirements, and implementation details.",
    tags: ["Technical", "Project X123", "Specifications", "Architecture"],
    metadata: {
      createdBy: "john.smith@example.com",
      department: "Engineering",
      confidentiality: "Internal",
      version: "1.2",
      reviewStatus: "Approved",
    },
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{document.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-500 hover:text-red-500">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-md">{document.type} Document</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium">Source</p>
                  <p className="text-sm text-muted-foreground">{document.source}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-sm text-muted-foreground">{new Date(document.date).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p className="text-sm text-muted-foreground">{document.size}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Pages</p>
                  <p className="text-sm text-muted-foreground">{document.pages}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">{document.language}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Entities Extracted</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Project IDs</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Client Names</span>
                  <span className="text-sm font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Vendor Names</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costs</span>
                  <span className="text-sm font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dates</span>
                  <span className="text-sm font-medium">10</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span className="text-sm">Total</span>
                  <span className="text-sm">{document.entities}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="entities">Entities</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="preview" className="mt-0">
                <DocumentViewer documentId={documentId} />
              </TabsContent>

              <TabsContent value="entities" className="mt-0">
                <EntityList documentId={documentId} />
              </TabsContent>

              <TabsContent value="metadata" className="mt-0">
                <DocumentMetadata document={document} />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <DocumentHistory documentId={documentId} />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

