import { useMutation } from "@tanstack/react-query"

async function downloadDocument(id: string) {
  const response = await fetch(`/api/documents/${id}/download`)
  if (!response.ok) {
    throw new Error("Failed to download document")
  }
  
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `document-${id}.pdf` // or use the actual filename from response headers
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function useDocumentDownload() {
  return useMutation({
    mutationFn: downloadDocument,
  })
} 