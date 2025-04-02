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
import { Plus, Tag, X } from 'lucide-react'

interface Entity {
  id: string
  name: string
  type: string
  confidence: number
  occurrences: number
}

interface EntityListProps {
  documentId: string
  entities: Entity[]
  onEntityAdd?: (entity: Omit<Entity, 'id'>) => void
  onEntityRemove?: (entityId: string) => void
}

export function EntityList({
  documentId,
  entities,
  onEntityAdd,
  onEntityRemove,
}: EntityListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEntity, setNewEntity] = useState({
    name: '',
    type: '',
    confidence: 1,
    occurrences: 1,
  })

  const handleAddEntity = () => {
    onEntityAdd?.(newEntity)
    setNewEntity({
      name: '',
      type: '',
      confidence: 1,
      occurrences: 1,
    })
    setIsAddDialogOpen(false)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          <h3 className="font-semibold">Document Entities</h3>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Entity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newEntity.name}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={newEntity.type}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, type: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddEntity} disabled={!newEntity.name || !newEntity.type}>
                Add Entity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{entity.name}</div>
                <div className="text-sm text-muted-foreground">
                  {entity.type} • {entity.occurrences} occurrences •{' '}
                  {Math.round(entity.confidence * 100)}% confidence
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEntityRemove?.(entity.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}