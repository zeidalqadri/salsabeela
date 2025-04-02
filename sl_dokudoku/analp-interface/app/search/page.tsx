"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SearchResults } from "@/components/search-results"
import { Search, Filter, FileText, Calendar, User, DollarSign, MapPin } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Document Search</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Documents</CardTitle>
          <CardDescription>Search for documents using keywords, semantic queries, or entity filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by keyword or natural language query..."
                  className="pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Search</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
                <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <FileText className="mr-1 h-3 w-3" />
                    PDF
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <FileText className="mr-1 h-3 w-3" />
                    DOCX
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <FileText className="mr-1 h-3 w-3" />
                    TXT
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <Calendar className="mr-1 h-3 w-3" />
                    Last 7 days
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <Calendar className="mr-1 h-3 w-3" />
                    Last 30 days
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <Calendar className="mr-1 h-3 w-3" />
                    Last 90 days
                  </Badge>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pdf" />
                        <Label htmlFor="pdf" className="text-sm font-normal">
                          PDF
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="docx" />
                        <Label htmlFor="docx" className="text-sm font-normal">
                          DOCX
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="txt" />
                        <Label htmlFor="txt" className="text-sm font-normal">
                          TXT
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Entity Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="project-ids" />
                        <Label htmlFor="project-ids" className="text-sm font-normal">
                          Project IDs
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="client-names" />
                        <Label htmlFor="client-names" className="text-sm font-normal">
                          Client Names
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vendor-names" />
                        <Label htmlFor="vendor-names" className="text-sm font-normal">
                          Vendor Names
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="costs" />
                        <Label htmlFor="costs" className="text-sm font-normal">
                          Costs
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="date-from" className="text-sm font-normal w-20">
                          From
                        </Label>
                        <Input type="date" id="date-from" className="h-8" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="date-to" className="text-sm font-normal w-20">
                          To
                        </Label>
                        <Input type="date" id="date-to" className="h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Document Source</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="google-drive" />
                        <Label htmlFor="google-drive" className="text-sm font-normal">
                          Google Drive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sharepoint" />
                        <Label htmlFor="sharepoint" className="text-sm font-normal">
                          SharePoint
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="local-upload" />
                        <Label htmlFor="local-upload" className="text-sm font-normal">
                          Local Upload
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="mt-2">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </TabsContent>

              <TabsContent value="semantic" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Semantic Search Examples:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="cursor-pointer hover:underline text-primary">
                        "Show me all documents related to Project X123"
                      </li>
                      <li className="cursor-pointer hover:underline text-primary">
                        "Find contracts with vendor ABC Corporation from last year"
                      </li>
                      <li className="cursor-pointer hover:underline text-primary">
                        "What are the budget requirements for the new initiative?"
                      </li>
                      <li className="cursor-pointer hover:underline text-primary">
                        "Show me documents with deadlines in the next 30 days"
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Label>Entity Focus</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        <User className="mr-1 h-3 w-3" />
                        People
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        <DollarSign className="mr-1 h-3 w-3" />
                        Financial
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        <Calendar className="mr-1 h-3 w-3" />
                        Dates
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        <MapPin className="mr-1 h-3 w-3" />
                        Locations
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>

      {hasSearched && <SearchResults query={query} />}
    </div>
  )
}

