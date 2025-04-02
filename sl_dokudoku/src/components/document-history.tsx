'use client'

import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Clock, Download, MoreVertical, Undo2 } from 'lucide-react'

interface DocumentVersion {
  id: string
  version: number
  createdAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  changes: string[]
  size: number
}

interface DocumentHistoryProps {
  documentId: string
  versions: DocumentVersion[]
  onRestore?: (versionId: string) => Promise<void>
  onDownload?: (versionId: string) => Promise<void>
}

export function DocumentHistory({
  documentId,
  versions,
  onRestore,
  onDownload,
}: DocumentHistoryProps) {
  const handleRestore = async (versionId: string) => {
    try {
      if (onRestore) {
        await onRestore(versionId)
      }
    } catch (error) {
      console.error('Failed to restore version:', error)
    }
  }

  const handleDownload = async (versionId: string) => {
    try {
      if (onDownload) {
        await onDownload(versionId)
      }
    } catch (error) {
      console.error('Failed to download version:', error)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="font-semibold">Version History</h3>
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>Modified By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>v{version.version}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {version.changes.map((change, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {change}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{version.createdBy.name}</TableCell>
                <TableCell>{formatDate(version.createdAt)}</TableCell>
                <TableCell>{(version.size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRestore(version.id)}
                      >
                        <Undo2 className="w-4 h-4 mr-2" />
                        Restore
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDownload(version.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  )
} 