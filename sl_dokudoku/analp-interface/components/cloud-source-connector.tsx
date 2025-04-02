"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { HardDriveIcon as GoogleDrive, Database, FolderClosed, Cloud } from "lucide-react"

export function CloudSourceConnector() {
  const { toast } = useToast()
  const [connecting, setConnecting] = useState(false)

  const handleConnect = (source: string) => {
    setConnecting(true)

    // Simulate connection process
    setTimeout(() => {
      setConnecting(false)

      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${source}.`,
      })
    }, 2000)
  }

  return (
    <Tabs defaultValue="google-drive" className="space-y-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
        <TabsTrigger value="sharepoint">SharePoint</TabsTrigger>
        <TabsTrigger value="other">Other Sources</TabsTrigger>
      </TabsList>

      <TabsContent value="google-drive">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GoogleDrive className="h-6 w-6 text-blue-500" />
              <CardTitle>Google Drive</CardTitle>
            </div>
            <CardDescription>Connect to Google Drive to automatically ingest documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Switch id="auto-sync" />
              <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleConnect("Google Drive")} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect to Google Drive"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="sharepoint">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-700" />
              <CardTitle>SharePoint</CardTitle>
            </div>
            <CardDescription>Connect to SharePoint to automatically ingest documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Switch id="auto-sync-sp" />
              <Label htmlFor="auto-sync-sp">Enable automatic synchronization</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleConnect("SharePoint")} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect to SharePoint"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="other">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderClosed className="h-6 w-6 text-orange-500" />
                <CardTitle>Local Network</CardTitle>
              </div>
              <CardDescription>Connect to a local network folder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleConnect("Local Network")} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-blue-400" />
                <CardTitle>Other Cloud Storage</CardTitle>
              </div>
              <CardDescription>Connect to other cloud storage providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleConnect("Cloud Storage")} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

