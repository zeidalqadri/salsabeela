"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DocumentTable } from "@/components/documents/document-table"
import { FilterDialog } from "@/components/documents/filter-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Tag, Upload, Download, MoreHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUpdateDocument } from "@/hooks/useDocuments"
import { withAuth } from "@/lib/withAuth"
import { ProtectedComponent } from "@/components/auth/protected-component"
import { Suspense } from "react"
import { DraggableFolderTree } from "@/components/folders/draggable-folder-tree"
import { DraggableDocumentList } from "@/components/documents/draggable-document-list"
import { DocumentsManager } from "@/components/documents/documents-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GDriveImport } from "@/components/documents/gdrive-import"
import { DocumentGrid } from "@/components/document-grid"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const metadata = {
  title: "Documents",
  description: "Manage your documents and folders.",
};

function LoadingFolders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
          >
            <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingDocuments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-muted"
          ></div>
        ))}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortBy, setSortBy] = useState("date-desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleView = (id: string) => {
    router.push(`/documents/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/documents/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete document')
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const handleMove = async (id: string, folderId: string | null) => {
    try {
      const response = await fetch(`/api/documents/${id}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId }),
      })
      if (!response.ok) throw new Error('Failed to move document')
      toast({
        title: "Success",
        description: "Document moved successfully",
      })
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move document",
        variant: "destructive",
      })
      return false
    }
  }

  const handleTag = (id: string) => {
    router.push(`/documents/${id}/tags`)
  }

  const handleShare = (id: string) => {
    router.push(`/documents/${id}/share`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? "Grid View" : "List View"}
          </Button>
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {viewMode === "list" ? (
            <DraggableDocumentList
              documents={[]}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={handleMove}
              onTag={handleTag}
              onShare={handleShare}
              currentFolderId={null}
            />
          ) : (
            <DocumentGrid />
          )}
        </div>
        <div className="space-y-6">
          <GDriveImport />
          {/* Add other import options or actions here */}
        </div>
      </div>
    </div>
  )
}
