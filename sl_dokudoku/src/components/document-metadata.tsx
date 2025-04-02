'use client'

import { useState, useEffect } from 'react' // Import useEffect
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast' // Import toast
import { useUpdateDocument } from '@/hooks/useUpdateDocument' // Import the hook
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Edit2, Plus, Save, Trash2 } from 'lucide-react'
import type { MetadataField } from '@/lib/types'
import type { Tag } from '@prisma/client'; // Import Tag type
import { TagManager } from './TagManager'; // Import TagManager

interface DocumentMetadataProps {
  documentId: string;
  initialTitle: string;
  initialTags: Tag[]; // Add initialTags prop
  initialMetadata?: MetadataField[];
}

export function DocumentMetadata({
  documentId,
  initialTitle,
  initialTags = [], // Accept initialTags prop
  initialMetadata = [],
}: DocumentMetadataProps) {
  const [metadata, setMetadata] = useState<MetadataField[]>(initialMetadata);
  const [currentTitle, setCurrentTitle] = useState(initialTitle); // State for title
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateTitle, isPending, isError, error } = useUpdateDocument(); // Use isPending instead of isLoading

  // Update local title state if initialTitle prop changes
  useEffect(() => {
    setCurrentTitle(initialTitle);
  }, [initialTitle]);

  const handleAddField = () => {
    setMetadata([
      ...metadata,
      { key: '', value: '', type: 'text', options: [] },
    ])
  }

  const handleRemoveField = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index))
  }

  const handleFieldChange = (
    index: number,
    field: Partial<MetadataField>
  ) => {
    setMetadata(
      metadata.map((item, i) =>
        i === index ? { ...item, ...field } : item
      )
    )
  }

  const handleSave = () => {
    // Only save the title for now using the hook
    updateTitle(
      {
        documentId,
        data: { title: currentTitle },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Document title updated." });
          setIsEditing(false); // Exit editing mode on success
          // Custom metadata saving logic would go here if needed separately
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update title: ${err.message}`,
          });
        },
      }
    );
    // Note: The custom metadata state (metadata) is not saved by this action.
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Document Details</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      {/* Title Editing Section */}
      <div className="mb-4">
        <Label htmlFor="documentTitle">Title</Label>
        <Input
          id="documentTitle"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          disabled={!isEditing || isPending} // Disable while pending
          placeholder="Enter document title"
          className={isEditing ? "" : "border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none read-only:bg-transparent"}
          readOnly={!isEditing}
        />
      </div>
      <Separator className="my-4" />
      {/* Tag Manager Section */}
      <TagManager documentId={documentId} initialTags={initialTags} />
      <Separator className="my-4" />
      {/* Custom Metadata Section */}
      <h4 className="text-md font-semibold mb-3">Custom Metadata</h4>
      <ScrollArea className="h-[300px] pr-4"> {/* Adjusted height */}
        {metadata.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground italic">No custom metadata.</p>
        )}
        {metadata.map((field, index) => (
          <div key={index} className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label>Field Name</Label>
                <Input
                  value={field.key}
                  onChange={(e) =>
                    handleFieldChange(index, { key: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Enter field name"
                />
              </div>
              <div className="flex-1">
                <Label>Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    handleFieldChange(index, {
                      type: value as MetadataField['type'],
                    })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  onClick={() => handleRemoveField(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <Label>Value</Label>
              {field.type === 'select' ? (
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    handleFieldChange(index, { value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(index, { value: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Enter value"
                />
              )}
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </ScrollArea>
      {isEditing && (
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleAddField}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={isPending}> {/* Disable button while pending */}
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Changes"} 
          </Button>
        </div>
      )}
    </Card>
  )
}
