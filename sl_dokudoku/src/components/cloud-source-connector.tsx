'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Cloud, MoreVertical, Plus, Trash, Edit, Link2 } from 'lucide-react'
import type { CloudSource } from '@/lib/types' // Import shared type

interface CloudSourceConnectorProps {
  sources: CloudSource[]
  onSourceAdd?: (source: Omit<CloudSource, 'id' | 'status'>) => void
  onSourceEdit?: (sourceId: string, source: Partial<CloudSource>) => void
  onSourceDelete?: (sourceId: string) => void
  onSourceSync?: (sourceId: string) => void
}

export function CloudSourceConnector({
  sources,
  onSourceAdd,
  onSourceEdit,
  onSourceDelete,
  onSourceSync,
}: CloudSourceConnectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSource, setNewSource] = useState<Omit<CloudSource, 'id' | 'status'>>({
    name: '',
    type: 'google-drive',
  })

  const handleAddSource = () => {
    onSourceAdd?.(newSource)
    setNewSource({
      name: '',
      type: 'google-drive',
    })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: CloudSource['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-500'
      case 'disconnected':
        return 'text-gray-500'
      case 'error':
        return 'text-red-500'
      default:
        return ''
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          <h3 className="font-semibold">Cloud Sources</h3>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cloud Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Source Name</Label>
                <Input
                  id="name"
                  value={newSource.name}
                  onChange={(e) =>
                    setNewSource({ ...newSource, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type">Source Type</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded-md"
                  value={newSource.type}
                  onChange={(e) =>
                    setNewSource({
                      ...newSource,
                      type: e.target.value as CloudSource['type'],
                    })
                  }
                >
                  <option value="google-drive">Google Drive</option>
                  <option value="dropbox">Dropbox</option>
                  <option value="onedrive">OneDrive</option>
                  <option value="s3">Amazon S3</option>
                </select>
              </div>
              <Button onClick={handleAddSource} disabled={!newSource.name}>
                Add Source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{source.name}</div>
                <div className="text-sm text-muted-foreground">
                  {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                </div>
                <div className={`text-sm ${getStatusColor(source.status)}`}>
                  {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                  {source.lastSync && ` • Last sync: ${source.lastSync}`}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onSourceSync?.(source.id)}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Sync Now
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onSourceEdit?.(source.id, {
                        name: source.name,
                        type: source.type,
                      })
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onSourceDelete?.(source.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
