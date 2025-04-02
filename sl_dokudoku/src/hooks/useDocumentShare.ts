import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ShareDocumentData {
  documentId: string
  userId: string
  permission: "VIEW" | "EDIT"
}

interface RemoveShareData {
  documentId: string
  shareId: string
}

async function shareDocument(data: ShareDocumentData) {
  const response = await fetch(`/api/documents/${data.documentId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: data.userId,
      permission: data.permission,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to share document")
  }

  return response.json()
}

async function removeShare(data: RemoveShareData) {
  const response = await fetch(`/api/documents/${data.documentId}/share`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shareId: data.shareId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to remove share")
  }

  return response.json()
}

export function useDocumentShare() {
  const queryClient = useQueryClient()

  const shareMutation = useMutation({
    mutationFn: shareDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })

  return {
    shareDocument: shareMutation.mutateAsync,
    removeShare: removeMutation.mutateAsync,
    isSharing: shareMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
} 