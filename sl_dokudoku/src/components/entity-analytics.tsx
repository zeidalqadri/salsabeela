"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis 
} from "recharts"

interface EntityAnalyticsProps {
  timeRange: string
}

// Sample data for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const entityTypeData = [
  { name: "Person", value: 35 },
  { name: "Organization", value: 28 },
  { name: "Location", value: 15 },
  { name: "Date", value: 12 },
  { name: "Money", value: 8 },
  { name: "Misc", value: 2 },
]

const extractionTrendData = [
  { name: "Jan", entities: 320 },
  { name: "Feb", entities: 450 },
  { name: "Mar", entities: 380 },
  { name: "Apr", entities: 520 },
  { name: "May", entities: 650 },
  { name: "Jun", entities: 710 },
  { name: "Jul", entities: 830 },
]

const topProjectsData = [
  { name: "PROJ-2023-001", count: 125 },
  { name: "PROJ-2023-042", count: 98 },
  { name: "PROJ-2023-107", count: 87 },
  { name: "PROJ-2022-365", count: 76 },
  { name: "PROJ-2023-021", count: 65 },
]

const topOrgsData = [
  { name: "Microsoft", count: 154 },
  { name: "Google", count: 143 },
  { name: "Apple Inc", count: 95 },
  { name: "Amazon", count: 72 },
  { name: "Facebook", count: 54 },
]

// Sample relationship data for the network graph
const relationshipData = [
  { x: 200, y: 200, z: 200, name: 'Microsoft', category: 'Organization' },
  { x: 120, y: 100, z: 260, name: 'Google', category: 'Organization' },
  { x: 170, y: 300, z: 400, name: 'New York', category: 'Location' },
  { x: 140, y: 250, z: 280, name: 'John Smith', category: 'Person' },
  { x: 110, y: 220, z: 320, name: 'April 2023', category: 'Date' },
  { x: 80, y: 190, z: 290, name: 'Amazon', category: 'Organization' },
  { x: 90, y: 280, z: 250, name: 'Jane Doe', category: 'Person' },
  { x: 170, y: 190, z: 330, name: 'Contract', category: 'Document' },
  { x: 130, y: 290, z: 240, name: 'Proposal', category: 'Document' },
]

export function EntityAnalytics({ timeRange }: EntityAnalyticsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">Across all documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entity Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Different entity categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extraction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.6</div>
            <p className="text-xs text-muted-foreground">Entities per document (avg)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">Average confidence level</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Entity Distribution</TabsTrigger>
          <TabsTrigger value="trends">Extraction Trends</TabsTrigger>
          <TabsTrigger value="relationships">Entity Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Entity Type Distribution</CardTitle>
                <CardDescription>Distribution of entities by type</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={entityTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {entityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Project IDs</CardTitle>
                <CardDescription>Most frequently mentioned project identifiers</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topProjectsData}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Organizations</CardTitle>
                <CardDescription>Most frequently mentioned organizations</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topOrgsData}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Extraction Over Time</CardTitle>
              <CardDescription>Number of entities extracted over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={extractionTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="entities" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Entities Extracted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationships</CardTitle>
              <CardDescription>Connections between different entities</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="relation" />
                  <YAxis type="number" dataKey="y" name="strength" />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="volume" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background p-2 border rounded shadow-sm">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm">Category: {data.category}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Entities" 
                    data={relationshipData} 
                    fill="#8884d8"
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
} 