import { useState } from "react"
import { MoreHorizontal, Pencil, Trash, Share, Download } from "lucide-react"
import type { DocumentWithRelations } from "@/types/document"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDocumentActions } from "@/hooks/useDocumentActions"
import { ShareModal } from "./share-modal"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DocumentActionsProps {
  document: DocumentWithRelations
}

export function DocumentActions({ document }: DocumentActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const {
    handleDelete,
    handleDownload,
    handleEdit,
    isDeleting,
    isDownloading,
  } = useDocumentActions()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(document.id)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowShareModal(true)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload(document.id, document.name)}
            disabled={isDownloading}
          >
            <div className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download
              {isDownloading && <LoadingSpinner className="ml-2" />}
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document &quot;{document.name}&quot; and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleDelete(document.id)
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <LoadingSpinner className="mr-2" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ShareModal
        document={document}
        open={showShareModal}
        onOpenChange={setShowShareModal}
      />
    </>
  )
} 