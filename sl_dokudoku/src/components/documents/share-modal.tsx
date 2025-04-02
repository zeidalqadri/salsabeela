import { useState } from "react"
import { Check, Copy, X } from "lucide-react"
import type { DocumentWithRelations } from "@/types/document"
import type { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useUsers } from "@/hooks/useUsers"
import { useDocumentShare } from "@/hooks/useDocumentShare"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ShareModalProps {
  document: DocumentWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareModal({ document, open, onOpenChange }: ShareModalProps) {
  const [selectedUserId, setSelectedUserId] = useState("")
  const [permission, setPermission] = useState<"VIEW" | "EDIT">("VIEW")
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const { shareDocument, removeShare, isSharing, isRemoving } = useDocumentShare()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await shareDocument({
        documentId: document.id,
        userId: selectedUserId,
        permission,
      })
      toast({
        title: "Document shared",
        description: "The document has been shared successfully.",
      })
      setSelectedUserId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveShare = async (shareId: string) => {
    try {
      await removeShare({
        documentId: document.id,
        shareId,
      })
      toast({
        title: "Share removed",
        description: "The share has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove the share. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/documents/${document.id}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{document.name}" with other users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={`${window.location.origin}/documents/${document.id}`}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: User) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={permission}
              onValueChange={setPermission as (value: string) => void}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">View</SelectItem>
                <SelectItem value="EDIT">Edit</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleShare}
              disabled={!selectedUserId || isSharing}
            >
              {isSharing ? (
                <div className="flex items-center">
                  <LoadingSpinner className="mr-2" />
                  Sharing...
                </div>
              ) : (
                "Share"
              )}
            </Button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Shared with</h4>
            <div className="space-y-2">
              {document.shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <span>{share.user.name || share.user.email}</span>
                    <span className="text-xs text-muted-foreground">
                      ({share.permission})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveShare(share.id)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <LoadingSpinner className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
              {document.shares.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  This document hasn't been shared with anyone yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 