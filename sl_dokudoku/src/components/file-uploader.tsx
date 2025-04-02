'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress' // Assuming Progress component exists or will be added
import { UploadCloud, File as FileIcon, X } from 'lucide-react'

interface UploadedFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }))
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles])
    // Start actual upload process
    startUpload(newFiles)
  }, [])

  // Function to handle actual file upload
  const startUpload = (filesToUpload: UploadedFile[]) => {
    filesToUpload.forEach(async (uploadedFile) => {
      // Update status to uploading
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === uploadedFile.file ? { ...f, status: 'uploading', progress: 0 } : f
        )
      )

      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      try {
        // TODO: Add progress tracking if backend supports it or use XHR
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        console.log('Upload result:', result) // Log success

        // Update status to completed
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === uploadedFile.file ? { ...f, status: 'completed', progress: 100 } : f
          )
        )
      } catch (error) {
        console.error('Upload error:', error)
        // Update status to error
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.file === uploadedFile.file
              ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
              : f
          )
        )
      }
    })
  }

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((f) => f.file !== fileToRemove)
    )
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // TODO: Add accepted file types if needed
    // accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: PDF, DOCX, PNG, JPG, etc. (Max 50MB)
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Files to Upload:</h4>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="space-y-3">
                {uploadedFiles.map(({ file, progress, status, error }, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileIcon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-40 flex-shrink-0">
                      {status === 'uploading' && (
                        <Progress value={progress} className="w-full h-2" />
                      )}
                      {status === 'completed' && (
                        <span className="text-xs text-green-600">Completed</span>
                      )}
                       {status === 'error' && (
                        <span className="text-xs text-red-600 truncate" title={error}>Error</span>
                      )}
                      {(status === 'pending' || status === 'error') && (
                         <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              {/* TODO: Add actual upload trigger button if needed, or handle automatically */}
              {/* <Button>Start Upload</Button> */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
