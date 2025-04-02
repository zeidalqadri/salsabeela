"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, MapPin, Calendar, DollarSign } from "lucide-react"

const results = [
  {
    id: "1",
    title: "Project X123 Technical Specification",
    type: "PDF",
    date: "2024-03-15",
    excerpt: "This technical specification outlines the requirements for Project X123...",
    entities: [
      { type: "organization", value: "Microsoft Corporation" },
      { type: "person", value: "John Smith" },
      { type: "location", value: "New York" },
      { type: "date", value: "January 2024" },
      { type: "financial", value: "$1.5 million" },
    ],
  },
  {
    id: "2",
    title: "Vendor Agreement - ABC Corporation",
    type: "DOCX",
    date: "2024-03-14",
    excerpt: "This agreement between ABC Corporation and our company establishes...",
    entities: [
      { type: "organization", value: "ABC Corporation" },
      { type: "person", value: "Jane Doe" },
      { type: "location", value: "Los Angeles" },
      { type: "date", value: "March 2024" },
      { type: "financial", value: "$50,000" },
    ],
  },
]

const getEntityIcon = (type: string) => {
  switch (type) {
    case "organization":
      return <FileText className="h-4 w-4" />
    case "person":
      return <User className="h-4 w-4" />
    case "location":
      return <MapPin className="h-4 w-4" />
    case "date":
      return <Calendar className="h-4 w-4" />
    case "financial":
      return <DollarSign className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export function SearchResults() {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{result.title}</CardTitle>
              <Badge>{result.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.date}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.excerpt}</p>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {result.entities.map((entity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-sm"
                  >
                    {getEntityIcon(entity.type)}
                    <span>{entity.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 