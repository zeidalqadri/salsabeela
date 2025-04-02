import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Clock, AlertTriangle, CheckCircle2, FileWarning, ArrowUpRight, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentDocuments } from "@/components/recent-documents"
import { ProcessingQueue } from "@/components/processing-queue"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Documents
            </Link>
          </Button>
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Recently processed documents in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDocuments />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Entity Extraction</CardTitle>
                <CardDescription>Top entities extracted from documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Project IDs</div>
                      <div className="text-muted-foreground">245 extracted</div>
                    </div>
                    <Progress value={72} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Client Names</div>
                      <div className="text-muted-foreground">189 extracted</div>
                    </div>
                    <Progress value={56} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Vendor Names</div>
                      <div className="text-muted-foreground">312 extracted</div>
                    </div>
                    <Progress value={92} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Costs</div>
                      <div className="text-muted-foreground">178 extracted</div>
                    </div>
                    <Progress value={52} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Dates</div>
                      <div className="text-muted-foreground">267 extracted</div>
                    </div>
                    <Progress value={78} />
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Full Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queued Documents</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Waiting to be processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <FileWarning className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Currently being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">Successfully processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">Failed to process</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Processing Queue</CardTitle>
              <CardDescription>Documents currently being processed by the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessingQueue />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Analytics</CardTitle>
              <CardDescription>Overview of document processing and entity extraction</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Detailed analytics are available in the Analytics section
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/analytics">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Go to Analytics
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

