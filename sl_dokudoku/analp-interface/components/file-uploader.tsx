"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

export function FileUploader() {
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Initialize progress for new files
      const newProgress: Record<string, number> = {}
      const newStatus: Record<string, string> = {}

      newFiles.forEach((file) => {
        newProgress[file.name] = 0
        newStatus[file.name] = "pending"
      })

      setUploadProgress((prev) => ({ ...prev, ...newProgress }))
      setUploadStatus((prev) => ({ ...prev, ...newStatus }))
    }
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName))

    // Remove from progress and status
    const newProgress = { ...uploadProgress }
    const newStatus = { ...uploadStatus }
    delete newProgress[fileName]
    delete newStatus[fileName]

    setUploadProgress(newProgress)
    setUploadStatus(newStatus)
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)

    // Simulate upload for each file
    for (const file of files) {
      // Update status to uploading
      setUploadStatus((prev) => ({ ...prev, [file.name]: "uploading" }))

      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
      }

      // Randomly simulate success or error (90% success rate)
      const isSuccess = Math.random() > 0.1

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: isSuccess ? "success" : "error",
      }))

      if (!isSuccess) {
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        })
      }
    }

    setUploading(false)

    // Count successful uploads
    const successCount = Object.values(uploadStatus).filter((status) => status === "success").length

    if (successCount > 0) {
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successCount} document(s).`,
      })
    }
  }

  const getFileIcon = (fileName: string) => {
    const status = uploadStatus[fileName]

    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "uploading":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium text-lg">Drag & drop files here</h3>
          <p className="text-sm text-muted-foreground">or click to browse files</p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, DOCX, TXT</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Selected Files ({files.length})</h4>

          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-2 p-2 border rounded-md">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="w-full mt-1">
                    <Progress value={uploadProgress[file.name] || 0} className="h-1" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)} disabled={uploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFiles([])
                setUploadProgress({})
                setUploadStatus({})
              }}
              disabled={uploading}
            >
              Clear All
            </Button>
            <Button onClick={uploadFiles} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

