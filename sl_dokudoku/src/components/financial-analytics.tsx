"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts"

interface FinancialAnalyticsProps {
  timeRange?: string
}

// Sample data for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const financialTrendData = [
  { name: "Jan", value: 240000 },
  { name: "Feb", value: 310000 },
  { name: "Mar", value: 280000 },
  { name: "Apr", value: 420000 },
  { name: "May", value: 380000 },
  { name: "Jun", value: 510000 },
  { name: "Jul", value: 580000 },
]

const currencyData = [
  { name: "USD", value: 65 },
  { name: "EUR", value: 15 },
  { name: "GBP", value: 10 },
  { name: "JPY", value: 5 },
  { name: "Other", value: 5 },
]

const transactionTypeData = [
  { name: "Invoice", value: 45 },
  { name: "Purchase Order", value: 28 },
  { name: "Contract", value: 15 },
  { name: "Receipt", value: 12 },
]

const valueDistributionData = [
  { range: "$0-$999", count: 320 },
  { range: "$1,000-$4,999", count: 280 },
  { range: "$5,000-$9,999", count: 180 },
  { range: "$10,000-$49,999", count: 120 },
  { range: "$50,000+", count: 60 },
]

const timelineData = [
  { date: "2023-01", invoices: 42, contracts: 12, orders: 28 },
  { date: "2023-02", invoices: 48, contracts: 18, orders: 31 },
  { date: "2023-03", invoices: 45, contracts: 15, orders: 26 },
  { date: "2023-04", invoices: 52, contracts: 22, orders: 35 },
  { date: "2023-05", invoices: 58, contracts: 19, orders: 42 },
  { date: "2023-06", invoices: 62, contracts: 25, orders: 45 },
  { date: "2023-07", invoices: 68, contracts: 29, orders: 53 },
]

export function FinancialAnalytics({ timeRange }: FinancialAnalyticsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">Total financial value extracted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">Financial transactions identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,923</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currency Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Different currencies detected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
          <TabsTrigger value="currencies">Currency Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Value Over Time</CardTitle>
                <CardDescription>Total financial value extracted by period</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={financialTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Financial Value']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    name="Financial Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Transaction Types</CardTitle>
                <CardDescription>Most common financial transaction categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Distribution</CardTitle>
                <CardDescription>Distribution of transaction values</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
              <CardDescription>Financial transactions over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timelineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="invoices" stackId="a" fill="#8884d8" name="Invoices" />
                  <Bar dataKey="contracts" stackId="a" fill="#82ca9d" name="Contracts" />
                  <Bar dataKey="orders" stackId="a" fill="#ffc658" name="Purchase Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Distribution</CardTitle>
              <CardDescription>Breakdown of detected currencies</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {currencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
} 