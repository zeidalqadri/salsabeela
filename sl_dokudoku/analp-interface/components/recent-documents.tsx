import { Badge } from "@/components/ui/badge"
import { FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export function RecentDocuments() {
  const documents = [
    {
      id: "doc-001",
      title: "Project X123 Technical Specification",
      type: "PDF",
      date: "2023-03-15",
      entities: 42,
      status: "Completed",
    },
    {
      id: "doc-002",
      title: "Vendor Agreement - ABC Corporation",
      type: "DOCX",
      date: "2023-03-14",
      entities: 38,
      status: "Completed",
    },
    {
      id: "doc-003",
      title: "Financial Report Q1 2023",
      type: "PDF",
      date: "2023-03-12",
      entities: 67,
      status: "Completed",
    },
    {
      id: "doc-004",
      title: "Meeting Minutes - Project Planning",
      type: "DOCX",
      date: "2023-03-10",
      entities: 24,
      status: "Completed",
    },
    {
      id: "doc-005",
      title: "Client Requirements Document",
      type: "PDF",
      date: "2023-03-08",
      entities: 51,
      status: "Completed",
    },
  ]

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-start gap-4 rounded-lg border p-3">
          <div className="rounded-md bg-primary/10 p-2">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium leading-none">{doc.title}</h4>
              <Badge variant="outline" className="ml-auto">
                {doc.type}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Processed on {doc.date} • {doc.entities} entities extracted
            </div>
            <div className="pt-2">
              <Link
                href={`/documents/${doc.id}`}
                className="inline-flex items-center text-xs text-primary hover:underline"
              >
                View Details
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

