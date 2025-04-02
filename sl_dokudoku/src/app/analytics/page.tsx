"use client"

import { useState } from "react"
import { DocumentAnalytics } from "@/components/document-analytics"
import { EntityAnalytics } from "@/components/entity-analytics"
import { FinancialAnalytics } from "@/components/financial-analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Document processing analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="documents" className="mt-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <DocumentAnalytics timeRange={timeRange} />
        </TabsContent>
        <TabsContent value="entities">
          <EntityAnalytics timeRange={timeRange} />
        </TabsContent>
        <TabsContent value="financial">
          <FinancialAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 