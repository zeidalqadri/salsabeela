"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  HardDriveIcon,
  Database,
  FolderClosed,
  Cloud,
  RefreshCw,
  Edit,
  Trash,
  Check,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SourcesPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("connected")

  // Mock source data
  const connectedSources = [
    {
      id: "source-001",
      name: "Google Drive - Project Documents",
      type: "Google Drive",
      status: "Connected",
      lastSync: "2023-03-15T10:30:00Z",
      documentsCount: 156,
      autoSync: true,
      path: "/Project Documents/EPCIC",
    },
    {
      id: "source-002",
      name: "SharePoint - Technical Documentation",
      type: "SharePoint",
      status: "Connected",
      lastSync: "2023-03-14T14:45:00Z",
      documentsCount: 87,
      autoSync: true,
      path: "https://company.sharepoint.com/sites/TechnicalDocs",
    },
    {
      id: "source-003",
      name: "Local Network - Contracts",
      type: "Local Network",
      status: "Connected",
      lastSync: "2023-03-12T09:15:00Z",
      documentsCount: 42,
      autoSync: false,
      path: "\\\\server\\shared\\contracts",
    },
    {
      id: "source-004",
      name: "Dropbox - Financial Reports",
      type: "Dropbox",
      status: "Error",
      lastSync: "2023-03-10T16:20:00Z",
      documentsCount: 28,
      autoSync: true,
      path: "/Financial Reports/2023",
    },
  ]

  const handleSync = (sourceId: string) => {
    toast({
      title: "Sync Started",
      description: "Synchronizing documents from the selected source.",
    })
  }

  const handleToggleAutoSync = (sourceId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Auto-Sync Enabled" : "Auto-Sync Disabled",
      description: `Auto-synchronization has been ${enabled ? "enabled" : "disabled"} for this source.`,
    })
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "Google Drive":
        return <HardDriveIcon className="h-6 w-6 text-blue-500" />
      case "SharePoint":
        return <Database className="h-6 w-6 text-blue-700" />
      case "Local Network":
        return <FolderClosed className="h-6 w-6 text-orange-500" />
      case "Dropbox":
        return <Cloud className="h-6 w-6 text-blue-400" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Connected":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        )
      case "Error":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Document Sources</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">Connected Sources</TabsTrigger>
          <TabsTrigger value="add">Add New Source</TabsTrigger>
          <TabsTrigger value="settings">Source Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedSources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3">
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No Sources Connected</h3>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                  Connect to document sources like Google Drive, SharePoint, or local network folders to start ingesting
                  documents.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connectedSources.map((source) => (
                <Card key={source.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(source.type)}
                        <CardTitle className="text-md">{source.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSync(source.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Now
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Source
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            <Trash className="mr-2 h-4 w-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{source.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        {getStatusBadge(source.status)}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Documents</span>
                        <span className="text-sm font-medium">{source.documentsCount}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Sync</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(source.lastSync).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Path</span>
                        <span className="text-sm text-muted-foreground truncate max-w-[150px]" title={source.path}>
                          {source.path}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm">Auto-Sync</span>
                        <Switch
                          checked={source.autoSync}
                          onCheckedChange={(checked) => handleToggleAutoSync(source.id, checked)}
                        />
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleSync(source.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Document Source</CardTitle>
              <CardDescription>Connect to a document source to automatically ingest documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="google-drive" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
                  <TabsTrigger value="sharepoint">SharePoint</TabsTrigger>
                  <TabsTrigger value="local">Local Network</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>

                <TabsContent value="google-drive" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input id="source-name" placeholder="e.g., Google Drive - Project Documents" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input id="client-id" placeholder="Your Google API Client ID" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-secret">Client Secret</Label>
                    <Input id="client-secret" type="password" placeholder="Your Google API Client Secret" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="folder-path">Folder Path</Label>
                    <Input id="folder-path" placeholder="Path to folder (e.g., /Documents/EPCIC)" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync" defaultChecked />
                    <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval</Label>
                    <select
                      id="sync-interval"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                      <option value="360">Every 6 hours</option>
                      <option value="720">Every 12 hours</option>
                      <option value="1440">Every day</option>
                    </select>
                  </div>

                  <Button className="w-full">Connect to Google Drive</Button>
                </TabsContent>

                <TabsContent value="sharepoint" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name-sp">Source Name</Label>
                    <Input id="source-name-sp" placeholder="e.g., SharePoint - Technical Documentation" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenant-id">Tenant ID</Label>
                    <Input id="tenant-id" placeholder="Your SharePoint Tenant ID" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-id-sp">Client ID</Label>
                    <Input id="client-id-sp" placeholder="Your SharePoint Client ID" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-secret-sp">Client Secret</Label>
                    <Input id="client-secret-sp" type="password" placeholder="Your SharePoint Client Secret" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" placeholder="https://company.sharepoint.com/sites/project" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="library-name">Document Library</Label>
                    <Input id="library-name" placeholder="Documents" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync-sp" defaultChecked />
                    <Label htmlFor="auto-sync-sp">Enable automatic synchronization</Label>
                  </div>

                  <Button className="w-full">Connect to SharePoint</Button>
                </TabsContent>

                <TabsContent value="local" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name-local">Source Name</Label>
                    <Input id="source-name-local" placeholder="e.g., Local Network - Contracts" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="network-path">Network Path</Label>
                    <Input id="network-path" placeholder="\\server\shared\documents" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username (if required)</Label>
                    <Input id="username" placeholder="domain\username" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password (if required)</Label>
                    <Input id="password" type="password" placeholder="Your password" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync-local" />
                    <Label htmlFor="auto-sync-local">Enable automatic synchronization</Label>
                  </div>

                  <Button className="w-full">Connect to Local Network</Button>
                </TabsContent>

                <TabsContent value="other" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name-other">Source Name</Label>
                    <Input id="source-name-other" placeholder="e.g., Dropbox - Financial Reports" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a provider</option>
                      <option value="dropbox">Dropbox</option>
                      <option value="box">Box</option>
                      <option value="onedrive">OneDrive</option>
                      <option value="aws-s3">AWS S3</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key / Access Token</Label>
                    <Input id="api-key" placeholder="Your API Key or Access Token" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="folder-path-other">Folder Path</Label>
                    <Input id="folder-path-other" placeholder="Path to folder" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-sync-other" defaultChecked />
                    <Label htmlFor="auto-sync-other">Enable automatic synchronization</Label>
                  </div>

                  <Button className="w-full">Connect to Source</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Source Settings</CardTitle>
              <CardDescription>Configure global settings for document sources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-sync-interval">Default Sync Interval</Label>
                <select
                  id="default-sync-interval"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60" selected>
                    Every hour
                  </option>
                  <option value="360">Every 6 hours</option>
                  <option value="720">Every 12 hours</option>
                  <option value="1440">Every day</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-types">Default File Types</Label>
                <Input id="file-types" placeholder="pdf,docx,txt,xlsx" defaultValue="pdf,docx,txt,xlsx" />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated list of file extensions to process</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-sync-default" defaultChecked />
                <Label htmlFor="auto-sync-default">Enable automatic synchronization by default</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="process-immediately" defaultChecked />
                <Label htmlFor="process-immediately">Process documents immediately after sync</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="notify-errors" defaultChecked />
                <Label htmlFor="notify-errors">Notify administrators of sync errors</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" />
                <p className="text-xs text-muted-foreground mt-1">Files larger than this size will not be processed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Sync Retry Attempts</Label>
                <Input id="retry-attempts" type="number" defaultValue="3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of times to retry syncing if an error occurs
                </p>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

