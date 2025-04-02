"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityAnalytics } from "@/components/entity-analytics"
import { DocumentAnalytics } from "@/components/document-analytics"
import { FinancialAnalytics } from "@/components/financial-analytics"
import { Download } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="entities">Entity Analytics</TabsTrigger>
          <TabsTrigger value="documents">Document Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,302</div>
                <p className="text-xs text-muted-foreground">+24 from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entities Extracted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,456</div>
                <p className="text-xs text-muted-foreground">+1,234 from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Time (avg)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4s</div>
                <p className="text-xs text-muted-foreground">-2.1s from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Extraction Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+1.5% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Document Processing Trends</CardTitle>
                <CardDescription>Number of documents processed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">Document Processing Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Entity Distribution</CardTitle>
                <CardDescription>Types of entities extracted from documents</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground">Entity Distribution Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Sources</CardTitle>
              <CardDescription>Distribution of documents by source</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="h-full w-full rounded-md border bg-muted/50 flex items-center justify-center">
                <p className="text-muted-foreground">Document Sources Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          <EntityAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

