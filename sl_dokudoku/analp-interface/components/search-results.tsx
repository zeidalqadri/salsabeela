"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Download, BarChart3 } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState("documents")

  // Mock search results
  const documentResults = [
    {
      id: "doc-001",
      title: "Project X123 Technical Specification",
      type: "PDF",
      date: "2023-03-15",
      excerpt: "...the <mark>Project X123</mark> requires specific technical considerations including...",
      entities: [
        { type: "Project ID", value: "X123" },
        { type: "Client", value: "Acme Corp" },
        { type: "Cost", value: "$1.2M" },
      ],
    },
    {
      id: "doc-002",
      title: "Vendor Agreement - ABC Corporation",
      type: "DOCX",
      date: "2023-03-14",
      excerpt:
        "...agreement between <mark>Acme Corp</mark> and ABC Corporation regarding <mark>Project X123</mark> deliverables...",
      entities: [
        { type: "Project ID", value: "X123" },
        { type: "Vendor", value: "ABC Corporation" },
        { type: "Date", value: "2023-12-31" },
      ],
    },
    {
      id: "doc-003",
      title: "Financial Report Q1 2023",
      type: "PDF",
      date: "2023-03-12",
      excerpt: "...budget allocation for <mark>Project X123</mark> has been increased by 15% due to scope changes...",
      entities: [
        { type: "Project ID", value: "X123" },
        { type: "Cost", value: "$1.38M" },
        { type: "Date", value: "2023-03-31" },
      ],
    },
    {
      id: "doc-004",
      title: "Meeting Minutes - Project Planning",
      type: "DOCX",
      date: "2023-03-10",
      excerpt: "...discussed timeline adjustments for <mark>Project X123</mark> with the client representatives...",
      entities: [
        { type: "Project ID", value: "X123" },
        { type: "Client", value: "Acme Corp" },
        { type: "Date", value: "2023-04-15" },
      ],
    },
    {
      id: "doc-005",
      title: "Client Requirements Document",
      type: "PDF",
      date: "2023-03-08",
      excerpt: "...<mark>Acme Corp</mark> has specified the following requirements for <mark>Project X123</mark>...",
      entities: [
        { type: "Project ID", value: "X123" },
        { type: "Client", value: "Acme Corp" },
        { type: "Location", value: "Building A" },
      ],
    },
  ]

  const entityResults = [
    {
      type: "Project ID",
      value: "X123",
      occurrences: 12,
      documents: 5,
    },
    {
      type: "Client",
      value: "Acme Corp",
      occurrences: 8,
      documents: 3,
    },
    {
      type: "Vendor",
      value: "ABC Corporation",
      occurrences: 5,
      documents: 2,
    },
    {
      type: "Cost",
      value: "$1.2M",
      occurrences: 4,
      documents: 2,
    },
    {
      type: "Date",
      value: "2023-12-31",
      occurrences: 3,
      documents: 1,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <CardDescription>Results for: &quot;{query}&quot;</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">Documents ({documentResults.length})</TabsTrigger>
            <TabsTrigger value="entities">Entities ({entityResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            {documentResults.map((doc) => (
              <div key={doc.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{doc.title}</h4>
                      <Badge variant="outline" className="ml-auto">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Processed on {doc.date}</div>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: doc.excerpt }} />

                    <div className="flex flex-wrap gap-2 pt-2">
                      {doc.entities.map((entity, idx) => (
                        <Badge key={idx} variant="secondary">
                          {entity.type}: {entity.value}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/documents/${doc.id}`}>
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Document
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            {entityResults.map((entity, idx) => (
              <div key={idx} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge>{entity.type}</Badge>
                    <h4 className="mt-2 text-lg font-medium">{entity.value}</h4>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{entity.occurrences} occurrences</div>
                    <div>Found in {entity.documents} documents</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    View Analytics
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

