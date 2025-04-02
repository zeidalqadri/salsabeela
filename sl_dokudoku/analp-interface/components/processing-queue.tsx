import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"

export function ProcessingQueue() {
  const queueItems = [
    {
      id: "queue-001",
      title: "Annual Financial Report.pdf",
      status: "In Progress",
      progress: 65,
      timeRemaining: "2 min",
    },
    {
      id: "queue-002",
      title: "Project Proposal - New Initiative.docx",
      status: "In Progress",
      progress: 32,
      timeRemaining: "5 min",
    },
    {
      id: "queue-003",
      title: "Technical Documentation v2.pdf",
      status: "In Progress",
      progress: 89,
      timeRemaining: "< 1 min",
    },
    {
      id: "queue-004",
      title: "Meeting Minutes - March 2023.docx",
      status: "In Progress",
      progress: 12,
      timeRemaining: "8 min",
    },
    {
      id: "queue-005",
      title: "Vendor Contract - XYZ Corp.pdf",
      status: "Queued",
      progress: 0,
      timeRemaining: "Waiting",
    },
    {
      id: "queue-006",
      title: "Project Timeline.pdf",
      status: "Queued",
      progress: 0,
      timeRemaining: "Waiting",
    },
    {
      id: "queue-007",
      title: "Budget Allocation 2023.xlsx",
      status: "Error",
      progress: 0,
      timeRemaining: "Failed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        )
      case "Queued":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Queued
          </Badge>
        )
      case "Error":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {queueItems.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{item.title}</h4>
            {getStatusBadge(item.status)}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Time remaining: {item.timeRemaining}</span>
              {item.status === "Error" && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

