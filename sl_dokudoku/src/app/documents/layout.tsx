'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderTree } from '@/components/folders/folder-tree';
import { useFolders } from '@/hooks/useFolders';
import { Skeleton } from '@/components/ui/skeleton';
import { withAuth } from "@/components/auth/with-auth"

function DocumentsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("folderId")

  const handleFolderSelect = (selectedFolderId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedFolderId) {
      params.set("folderId", selectedFolderId)
    } else {
      params.delete("folderId")
    }
    params.set("page", "1")
    router.push(`/documents?${params.toString()}`)
  }

  return (
    <div className="flex h-full">
      <div className="w-64 p-4 border-r">
        <FolderTree
          selectedFolderId={folderId}
          onSelect={handleFolderSelect}
        />
      </div>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
}

export default withAuth(DocumentsLayout) 