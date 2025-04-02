import { useState } from "react"
import { Check, Copy, Search, X } from "lucide-react"
import { useDebounce } from "use-debounce"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserSearch } from "@/hooks/useUserSearch"
import { useDocumentShares } from "@/hooks/useDocumentShares"

interface ShareDialogProps {
  documentId: string
  trigger: React.ReactNode
}

export function ShareDialog({ documentId, trigger }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 300)

  const { data: searchResults, isLoading: isSearching } = useUserSearch(debouncedQuery)
  const {
    shares,
    isLoading: isLoadingShares,
    share,
    isSharing,
    updatePermission,
    isUpdating,
    remove,
    isRemoving,
  } = useDocumentShares(documentId)

  const handleShare = async (userId: string) => {
    try {
      await share({ userId, permission: "VIEW" })
      setSearchQuery("")
    } catch (error) {
      console.error("Error sharing document:", error)
    }
  }

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/documents/${documentId}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share this document with other users or copy the link to share.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Button
              variant="outline"
              className="justify-start text-sm text-muted-foreground"
              onClick={handleCopyLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-4">
          {searchQuery && searchResults?.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>
                    {user.name?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleShare(user.id)}
                disabled={isSharing || shares?.some((s) => s.userId === user.id)}
              >
                {shares?.some((s) => s.userId === user.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "Share"
                )}
              </Button>
            </div>
          ))}
        </div>

        {shares && shares.length > 0 && (
          <>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Shared with</h4>
              {shares.map((share) => (
                <div key={share.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={share.user.image || undefined} />
                      <AvatarFallback>
                        {share.user.name?.charAt(0) || share.user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{share.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {share.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={share.permission}
                      onValueChange={(value: "VIEW" | "EDIT") =>
                        updatePermission({ userId: share.userId, permission: value })
                      }
                    >
                      <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEW">Can view</SelectItem>
                        <SelectItem value="EDIT">Can edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => remove(share.userId)}
                      disabled={isRemoving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}