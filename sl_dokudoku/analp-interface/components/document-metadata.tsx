"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, X } from "lucide-react"
import { useState } from "react"

interface DocumentMetadataProps {
  document: any
}

export function DocumentMetadata({ document }: DocumentMetadataProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tags, setTags] = useState<string[]>(document.tags || [])
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Metadata</h3>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Metadata
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            defaultValue={document.title}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            defaultValue={document.author}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            defaultValue={document.language}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            defaultValue={document.metadata.department}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confidentiality">Confidentiality</Label>
          <Input
            id="confidentiality"
            defaultValue={document.metadata.confidentiality}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            defaultValue={document.metadata.version}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            defaultValue={document.description}
            readOnly={!isEditing}
            className={!isEditing ? "bg-muted resize-none" : "resize-none"}
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tag}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}

            {isEditing && (
              <div className="flex gap-2 items-center">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  className="w-40 h-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button>Save Changes</Button>
        </div>
      )}
    </div>
  )
}

