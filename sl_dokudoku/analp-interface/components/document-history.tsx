import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, RotateCcw, User, Edit, Upload, Eye } from "lucide-react"

interface DocumentHistoryProps {
  documentId: string
}

export function DocumentHistory({ documentId }: DocumentHistoryProps) {
  // Mock history data
  const historyItems = [
    {
      id: "history-001",
      action: "Viewed",
      user: "John Smith",
      timestamp: "2023-03-20T14:32:00Z",
      details: "Document viewed by user",
    },
    {
      id: "history-002",
      action: "Metadata Updated",
      user: "Jane Doe",
      timestamp: "2023-03-18T10:15:00Z",
      details: "Updated document tags and description",
    },
    {
      id: "history-003",
      action: "Downloaded",
      user: "John Smith",
      timestamp: "2023-03-17T16:45:00Z",
      details: "Document downloaded by user",
    },
    {
      id: "history-004",
      action: "Processing Completed",
      user: "System",
      timestamp: "2023-03-15T08:30:00Z",
      details: "Document processing completed successfully. 42 entities extracted.",
    },
    {
      id: "history-005",
      action: "Processing Started",
      user: "System",
      timestamp: "2023-03-15T08:25:00Z",
      details: "Document processing started",
    },
    {
      id: "history-006",
      action: "Uploaded",
      user: "John Smith",
      timestamp: "2023-03-15T08:20:00Z",
      details: "Document uploaded from Google Drive",
    },
    {
      id: "history-007",
      action: "Version Created",
      user: "John Smith",
      timestamp: "2023-03-10T11:05:00Z",
      details: "Document version 1.2 created",
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Viewed":
        return <Eye className="h-4 w-4" />
      case "Metadata Updated":
        return <Edit className="h-4 w-4" />
      case "Downloaded":
        return <Download className="h-4 w-4" />
      case "Processing Completed":
        return <FileText className="h-4 w-4" />
      case "Processing Started":
        return <RotateCcw className="h-4 w-4" />
      case "Uploaded":
        return <Upload className="h-4 w-4" />
      case "Version Created":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Viewed":
        return <Badge variant="outline">Viewed</Badge>
      case "Metadata Updated":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Updated</Badge>
      case "Downloaded":
        return <Badge variant="outline">Downloaded</Badge>
      case "Processing Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "Processing Started":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>
      case "Uploaded":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Uploaded</Badge>
      case "Version Created":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">New Version</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document History</h3>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
            <div className="mt-0.5 rounded-full bg-muted p-2">{getActionIcon(item.action)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {getActionBadge(item.action)}
                <span className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm">{item.details}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{item.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

