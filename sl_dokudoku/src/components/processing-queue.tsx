"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type ProcessingStatus = "queued" | "processing" | "completed" | "failed"

interface QueueItem {
  id: string
  filename: string
  status: ProcessingStatus
  progress: number
  error?: string
}

export function ProcessingQueue() {
  // Mock data - replace with actual queue data
  const [queue] = useState<QueueItem[]>([
    {
      id: "1",
      filename: "document1.pdf",
      status: "processing",
      progress: 45,
    },
    {
      id: "2",
      filename: "document2.docx",
      status: "queued",
      progress: 0,
    },
    {
      id: "3",
      filename: "document3.txt",
      status: "completed",
      progress: 100,
    },
    {
      id: "4",
      filename: "document4.pdf",
      status: "failed",
      progress: 30,
      error: "Invalid file format",
    },
  ])

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case "queued":
        return "bg-yellow-500/20 text-yellow-500"
      case "processing":
        return "bg-blue-500/20 text-blue-500"
      case "completed":
        return "bg-green-500/20 text-green-500"
      case "failed":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.filename}</span>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(item.status)}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>

              <Progress value={item.progress} className="h-2" />

              {item.error && (
                <p className="text-sm text-red-500">{item.error}</p>
              )}
            </div>
          ))}

          {queue.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents in the processing queue
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 