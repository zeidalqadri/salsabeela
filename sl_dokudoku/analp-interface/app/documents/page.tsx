"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentList } from "@/components/document-list"
import { DocumentGrid } from "@/components/document-grid"
import { Search, Filter, Upload, Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortBy, setSortBy] = useState("date-desc")
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Document Categories</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start font-normal">
                  All Documents
                  <span className="ml-auto text-muted-foreground">1,302</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Contracts
                  <span className="ml-auto text-muted-foreground">245</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Technical Specifications
                  <span className="ml-auto text-muted-foreground">187</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Financial Reports
                  <span className="ml-auto text-muted-foreground">156</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Meeting Minutes
                  <span className="ml-auto text-muted-foreground">98</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  Other
                  <span className="ml-auto text-muted-foreground">616</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-md">Filters</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="txt">TXT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select defaultValue="all-time">
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-time">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="upload">Manual Upload</SelectItem>
                      <SelectItem value="google-drive">Google Drive</SelectItem>
                      <SelectItem value="sharepoint">SharePoint</SelectItem>
                      <SelectItem value="local">Local Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Processing Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="queued">Queued</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>Browse and manage all documents in the system</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents..."
                      className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">Newest First</SelectItem>
                        <SelectItem value="date-asc">Oldest First</SelectItem>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="type">File Type</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-r-none ${viewMode === "list" ? "bg-muted" : ""}`}
                        onClick={() => setViewMode("list")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-list"
                        >
                          <line x1="8" x2="21" y1="6" y2="6" />
                          <line x1="8" x2="21" y1="12" y2="12" />
                          <line x1="8" x2="21" y1="18" y2="18" />
                          <line x1="3" x2="3.01" y1="6" y2="6" />
                          <line x1="3" x2="3.01" y1="12" y2="12" />
                          <line x1="3" x2="3.01" y1="18" y2="18" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-l-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                        onClick={() => setViewMode("grid")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-grid"
                        >
                          <rect width="7" height="7" x="3" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="14" rx="1" />
                          <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "list" ? <DocumentList sortBy={sortBy} /> : <DocumentGrid sortBy={sortBy} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
