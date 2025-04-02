'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

interface DocumentViewerProps {
  documentUrl?: string
  documentContent?: string
  documentType?: string
  fileName: string
  metadata?: Record<string, any>
}

export function DocumentViewer({
  documentUrl,
  documentContent,
  documentType = 'text',
  fileName,
  metadata,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={documentUrl} download={fileName}>
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="preview" className="flex-1">
        <TabsList className="px-4 border-b">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div
              className="relative min-h-full"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
              }}
            >
              {documentType === 'pdf' ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full"
                  style={{ minHeight: '800px' }}
                />
              ) : (
                <div className="p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {documentContent}
                  </pre>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="text" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {documentContent}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="flex items-center justify-between p-4 border-t">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button variant="ghost" size="sm">
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  )
} 