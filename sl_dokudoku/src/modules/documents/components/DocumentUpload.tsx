"use client"

import { useState } from "react"
import { Upload, File as FileIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Document } from "@/modules/database/types"
import { ServiceContainer } from "@/modules/core/services/ServiceContainer"
import { DocumentProcessor } from "@/modules/documents/services/DocumentProcessor"

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const documentProcessor = ServiceContainer.getInstance().get<DocumentProcessor>('documentProcessor')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    await handleFiles(droppedFiles)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      await handleFiles(selectedFiles)
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    setIsProcessing(true)
    try {
      // Create a default project for now - in real app this would come from context/props
      const defaultProjectId = "default-project"
      
      for (const file of newFiles) {
        try {
          const document = await documentProcessor.processDocument(file, defaultProjectId)
          setDocuments(prev => [...prev, document])
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error)
          // Add failed document to state
          setDocuments(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            projectId: defaultProjectId,
            filename: file.name,
            fileType: file.type,
            status: 'failed',
            progress: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            entities: [],
            size: file.size
          }])
        }
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/10" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Drag and drop your files</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          or click to browse your computer
        </p>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          id="file-upload"
          disabled={isProcessing}
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={isProcessing}
        >
          Select Files
        </Button>
      </div>

      {documents.length > 0 && (
        <div className="mt-8 space-y-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="flex items-center p-4">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {doc.status}
                        {doc.entities.length > 0 && ` • ${doc.entities.length} entities found`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={doc.status === 'processing'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        doc.status === 'failed' ? 'bg-destructive' : 'bg-primary'
                      }`}
                      style={{ width: `${doc.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 