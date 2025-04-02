import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface DocumentAnalyticsProps {
  timeRange: string
}

export function DocumentAnalytics({ timeRange }: DocumentAnalyticsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,302</div>
            <p className="text-xs text-muted-foreground">Processed in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="mr-2">PDF: 68%</span>
              <span className="mr-2">DOCX: 24%</span>
              <span>TXT: 8%</span>
            </div>
            <p className="text-xs text-muted-foreground">Distribution by format</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4s</div>
            <p className="text-xs text-muted-foreground">Per document</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">Documents successfully processed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volume">Document Volume</TabsTrigger>
          <TabsTrigger value="sources">Document Sources</TabsTrigger>
          <TabsTrigger value="performance">Processing Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Document Processing Volume</CardTitle>
                <CardDescription>Number of documents processed over time</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Document Volume Chart</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Distribution of document formats</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">Document Types Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Size Distribution</CardTitle>
                <CardDescription>Distribution of document sizes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">Document Size Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Sources</CardTitle>
              <CardDescription>Distribution of documents by source</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Document Sources Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Performance</CardTitle>
              <CardDescription>Document processing time and success rate</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Processing Performance Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

