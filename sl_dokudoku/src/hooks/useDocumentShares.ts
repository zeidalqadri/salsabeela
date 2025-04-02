import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { DocumentShare, User } from "@prisma/client"

interface ShareWithUser extends DocumentShare {
  user: Pick<User, "id" | "name" | "email" | "image">
}

interface ShareDocumentData {
  userId: string
  permission: "VIEW" | "EDIT"
}

interface UpdateShareData {
  permission: "VIEW" | "EDIT"
}

async function getDocumentShares(documentId: string): Promise<ShareWithUser[]> {
  const response = await fetch(`/api/documents/${documentId}/shares`)
  if (!response.ok) {
    throw new Error("Failed to fetch document shares")
  }
  return response.json()
}

async function shareDocument(documentId: string, data: ShareDocumentData): Promise<ShareWithUser> {
  const response = await fetch(`/api/documents/${documentId}/shares`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to share document")
  }
  return response.json()
}

async function updateShare(
  documentId: string,
  userId: string,
  data: UpdateShareData
): Promise<ShareWithUser> {
  const response = await fetch(`/api/documents/${documentId}/shares/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update share")
  }
  return response.json()
}

async function removeShare(documentId: string, userId: string): Promise<void> {
  const response = await fetch(`/api/documents/${documentId}/shares/${userId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to remove share")
  }
}

export function useDocumentShares(documentId: string) {
  const queryClient = useQueryClient()
  const queryKey = ["documentShares", documentId]

  const { data: shares, isLoading } = useQuery({
    queryKey,
    queryFn: () => getDocumentShares(documentId),
    enabled: !!documentId,
  })

  const { mutate: share, isPending: isSharing } = useMutation({
    mutationFn: (data: ShareDocumentData) => shareDocument(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Document shared successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const { mutate: updatePermission, isPending: isUpdating } = useMutation({
    mutationFn: ({ userId, permission }: { userId: string; permission: "VIEW" | "EDIT" }) =>
      updateShare(documentId, userId, { permission }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Share permissions updated")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: (userId: string) => removeShare(documentId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Share removed")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    shares,
    isLoading,
    share,
    isSharing,
    updatePermission,
    isUpdating,
    remove,
    isRemoving,
  }
} 