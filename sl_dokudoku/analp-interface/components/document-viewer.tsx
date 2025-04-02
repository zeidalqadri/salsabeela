"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCw, Search, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react"

interface DocumentViewerProps {
  documentId: string
}

export function DocumentViewer({ documentId }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(24) // Mock total pages
  const [zoomLevel, setZoomLevel] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center p-2 bg-muted/50 rounded-md">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number.parseInt(e.target.value) || 1)}
              className="w-16 h-8"
            />
            <span className="text-sm text-muted-foreground">/ {totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 w-40">
            <Slider
              value={[zoomLevel]}
              min={50}
              max={200}
              step={10}
              onValueChange={(value) => setZoomLevel(value[0])}
            />
            <span className="text-sm w-12">{zoomLevel}%</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search in document..."
              className="pl-8 h-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="border rounded-md bg-white flex items-center justify-center"
        style={{
          height: "70vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          {/* Mock document page */}
          <div className="bg-white shadow-lg rounded-sm" style={{ width: "595px", height: "842px" }}>
            <div className="p-8 space-y-4">
              <h1 className="text-2xl font-bold">Project X123 Technical Specification</h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold">1. Introduction</h2>
                <p>
                  This document outlines the technical specifications for Project X123. It includes system architecture,
                  requirements, and implementation details for all stakeholders involved in the project.
                </p>

                <h3 className="text-lg font-medium mt-4">1.1 Purpose</h3>
                <p>
                  The purpose of this document is to provide a detailed technical overview of Project X123, ensuring all
                  team members and stakeholders have a clear understanding of the technical requirements and
                  implementation approach.
                </p>

                <h3 className="text-lg font-medium mt-4">1.2 Scope</h3>
                <p>This specification covers the following aspects of Project X123:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>System Architecture</li>
                  <li>Functional Requirements</li>
                  <li>Non-Functional Requirements</li>
                  <li>Data Models</li>
                  <li>API Specifications</li>
                  <li>Security Considerations</li>
                  <li>Implementation Timeline</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6">2. System Architecture</h2>
                <p>Project X123 follows a microservices architecture with the following key components:</p>

                {/* This is just a mock document content */}
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-muted-foreground">
                  [Document content continues...]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

