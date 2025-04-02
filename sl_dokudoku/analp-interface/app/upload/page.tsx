"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "@/components/file-uploader"
import { CloudSourceConnector } from "@/components/cloud-source-connector"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Document Upload</h2>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Manual Upload</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Sources</TabsTrigger>
          <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Upload documents for processing. Supported formats: PDF, DOCX, TXT.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Cloud Sources</CardTitle>
              <CardDescription>Connect to cloud storage services to automatically ingest documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <CloudSourceConnector />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Processing</CardTitle>
              <CardDescription>Configure batch processing for large document collections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-path">Local Folder Path</Label>
                  <div className="flex gap-2">
                    <Input id="folder-path" placeholder="/path/to/documents" className="flex-1" />
                    <Button variant="outline">Browse</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-pattern">File Pattern</Label>
                  <Input id="file-pattern" placeholder="*.pdf, *.docx, *.txt" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use comma-separated patterns to filter specific file types
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processing-schedule">Processing Schedule</Label>
                  <select
                    id="processing-schedule"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <Button className="w-full" disabled={isUploading}>
                  {isUploading ? "Processing..." : "Start Batch Processing"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

