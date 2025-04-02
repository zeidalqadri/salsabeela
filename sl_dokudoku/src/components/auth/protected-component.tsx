import { useRBAC } from "@/hooks/useRBAC"
import { Button } from "@/components/ui/button"

interface ProtectedComponentProps {
  documentId: string
  ownerId: string
}

export function ProtectedComponent({ documentId, ownerId }: ProtectedComponentProps) {
  const canView = useRBAC({ resource: "DOCUMENT", permission: "VIEW", ownerId })
  const canEdit = useRBAC({ resource: "DOCUMENT", permission: "EDIT", ownerId })
  const canDelete = useRBAC({ resource: "DOCUMENT", permission: "DELETE", ownerId })
  const canShare = useRBAC({ resource: "DOCUMENT", permission: "SHARE", ownerId })

  if (!canView) {
    return <div className="text-red-500">You don't have permission to view this document.</div>
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Document ID: {documentId}
      </div>
      
      <div className="flex gap-2">
        {canEdit && (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        )}
        
        {canDelete && (
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        )}
        
        {canShare && (
          <Button variant="outline" size="sm">
            Share
          </Button>
        )}
      </div>
    </div>
  )
} 