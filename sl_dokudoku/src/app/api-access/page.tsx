import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Copy, RefreshCw } from "lucide-react"

export default function ApiAccessPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">API Access</h1>
        <Button>
          <Key className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Production API Key</label>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  value="••••••••••••••••"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this key for production environments
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Development API Key</label>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  value="••••••••••••••••"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this key for testing and development
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls (This Month)</span>
                <span className="font-mono">0 / 10,000</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full w-0 bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your current usage and limits
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how to integrate our API into your applications
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Getting Started Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                API Reference
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Example Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 