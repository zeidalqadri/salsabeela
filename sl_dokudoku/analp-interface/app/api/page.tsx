"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ApiPage() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("sk_test_dokudoku_12345678901234567890")
  const [isGenerating, setIsGenerating] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "API key copied to clipboard",
    })
  }

  const regenerateApiKey = () => {
    setIsGenerating(true)

    // Simulate API key regeneration
    setTimeout(() => {
      const newKey =
        "sk_test_dokudoku_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setApiKey(newKey)
      setIsGenerating(false)

      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated successfully",
      })
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">API Access</h2>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access to the dokudoku system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input id="api-key" value={apiKey} readOnly type="password" className="pr-10" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(apiKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" onClick={regenerateApiKey} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep this key secret. Do not share it in publicly accessible areas.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-enabled">API Access</Label>
                  <Switch id="api-enabled" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Enable or disable API access to the dokudoku system.</p>
              </div>

              <div className="space-y-2">
                <Label>API Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="permission-read" defaultChecked />
                      <Label htmlFor="permission-read" className="text-sm font-normal">
                        Read Access
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Search and retrieve documents and entities</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="permission-write" defaultChecked />
                      <Label htmlFor="permission-write" className="text-sm font-normal">
                        Write Access
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload and process new documents</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="permission-analytics" defaultChecked />
                      <Label htmlFor="permission-analytics" className="text-sm font-normal">
                        Analytics Access
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Access analytics and reporting data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhooks to receive notifications when documents are processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-app.com/webhooks/dokudoku" />
              </div>

              <div className="space-y-2">
                <Label>Webhook Events</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="event-document-processed" defaultChecked />
                    <Label htmlFor="event-document-processed" className="text-sm font-normal">
                      Document Processed
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="event-document-error" defaultChecked />
                    <Label htmlFor="event-document-error" className="text-sm font-normal">
                      Document Processing Error
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="event-entity-extracted" />
                    <Label htmlFor="event-entity-extracted" className="text-sm font-normal">
                      Entity Extracted
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Webhook Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Reference documentation for the dokudoku API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Authentication</h3>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-mono">
                    curl -X GET https://api.dokudoku.com/v1/documents \<br />
                    -H "Authorization: Bearer {apiKey}"
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  All API requests must include your API key in the Authorization header.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Endpoints</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium">Document Upload</h4>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm font-mono">POST /v1/documents</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Upload a document for processing.</p>
                  </div>

                  <div>
                    <h4 className="text-md font-medium">Document Retrieval</h4>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm font-mono">GET /v1/documents/{"{id}"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Retrieve a processed document by ID.</p>
                  </div>

                  <div>
                    <h4 className="text-md font-medium">Search</h4>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm font-mono">GET /v1/search?q={"{query}"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Search for documents using keywords or semantic queries.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-md font-medium">Entity Retrieval</h4>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm font-mono">GET /v1/entities?type={"{type}"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Retrieve entities by type.</p>
                  </div>

                  <div>
                    <h4 className="text-md font-medium">Analytics</h4>
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-sm font-mono">GET /v1/analytics</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Retrieve analytics data.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View Full Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage & Limits</CardTitle>
              <CardDescription>Monitor your API usage and limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Usage</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md border p-4">
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-sm text-muted-foreground">API Requests (This Month)</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-2xl font-bold">87</div>
                    <p className="text-sm text-muted-foreground">Documents Uploaded</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-2xl font-bold">432</div>
                    <p className="text-sm text-muted-foreground">Search Queries</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Rate Limits</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">API Requests</span>
                        <span className="text-sm text-muted-foreground">1,245 / 10,000</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "12.45%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Document Processing</span>
                        <span className="text-sm text-muted-foreground">87 / 500</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "17.4%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Search Queries</span>
                        <span className="text-sm text-muted-foreground">432 / 2,000</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "21.6%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Rate limits reset on the 1st of each month.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Usage History</h3>
                <div className="h-[300px] rounded-md border bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">API Usage History Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

