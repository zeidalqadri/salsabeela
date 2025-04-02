"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink } from "lucide-react"

interface EntityListProps {
  documentId: string
}

export function EntityList({ documentId }: EntityListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [entityType, setEntityType] = useState("all")
  const [confidenceLevel, setConfidenceLevel] = useState("all")

  // Mock entity data
  const entities = [
    {
      id: "entity-001",
      type: "Project ID",
      value: "X123",
      confidence: 0.98,
      page: 1,
      position: "Header",
      context: "...specifications for Project X123 including system architecture...",
      occurrences: 24,
    },
    {
      id: "entity-002",
      type: "Client Name",
      value: "Acme Corporation",
      confidence: 0.95,
      page: 1,
      position: "Introduction",
      context: "...prepared for Acme Corporation as part of the ongoing...",
      occurrences: 12,
    },
  ]

  // Filter entities based on search query and filters
  const filteredEntities = entities.filter((entity) => {
    // Filter by search query
    if (searchQuery && !entity.value.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by entity type
    if (entityType !== "all" && entity.type !== entityType) {
      return false
    }

    // Filter by confidence level
    if (confidenceLevel === "high" && entity.confidence < 0.9) {
      return false
    } else if (confidenceLevel === "medium" && (entity.confidence < 0.7 || entity.confidence >= 0.9)) {
      return false
    } else if (confidenceLevel === "low" && entity.confidence >= 0.7) {
      return false
    }

    return true
  })

  // Group entities by type
  const entityTypes = [...new Set(entities.map((entity) => entity.type))]
  const groupedEntities: Record<string, typeof entities> = {}

  entityTypes.forEach((type) => {
    groupedEntities[type] = entities.filter((entity) => entity.type === type)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search entities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Confidence Levels</SelectItem>
              <SelectItem value="high">High ({">"}90%)</SelectItem>
              <SelectItem value="medium">Medium (70-90%)</SelectItem>
              <SelectItem value="low">Low ({"<"}70%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grouped">Grouped View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredEntities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No entities found matching your filters.</div>
          ) : (
            <div className="space-y-2">
              {filteredEntities.map((entity) => (
                <div key={entity.id} className="border rounded-md p-4 hover:bg-muted/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge>{entity.type}</Badge>
                        <span className="font-medium">{entity.value}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Page {entity.page} • {entity.occurrences} occurrences • Confidence:{" "}
                        {(entity.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      View in Document
                    </Button>
                  </div>
                  <div className="mt-2 text-sm bg-muted/50 p-2 rounded-md">
                    <span className="text-muted-foreground">Context: </span>
                    {entity.context}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grouped" className="space-y-4">
          {Object.keys(groupedEntities).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No entities found matching your filters.</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEntities).map(([type, entities]) => (
                <div key={type} className="space-y-2">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {type}
                    <Badge variant="outline">{entities.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {entities
                      .filter((entity) => {
                        if (searchQuery && !entity.value.toLowerCase().includes(searchQuery.toLowerCase())) {
                          return false
                        }
                        if (confidenceLevel === "high" && entity.confidence < 0.9) {
                          return false
                        } else if (
                          confidenceLevel === "medium" &&
                          (entity.confidence < 0.7 || entity.confidence >= 0.9)
                        ) {
                          return false
                        } else if (confidenceLevel === "low" && entity.confidence >= 0.7) {
                          return false
                        }
                        return true
                      })
                      .map((entity) => (
                        <div key={entity.id} className="border rounded-md p-3 hover:bg-muted/30">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-medium">{entity.value}</span>
                              <div className="text-sm text-muted-foreground">
                                Page {entity.page} • {entity.occurrences} occurrences • Confidence:{" "}
                                {(entity.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              View in Document
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

