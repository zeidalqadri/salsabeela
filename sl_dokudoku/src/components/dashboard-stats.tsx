"use client"

import { BarChart3, FileText, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStat {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardStatsProps {
  stats: DashboardStat[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const defaultStats: DashboardStat[] = [
  {
    title: "Total Documents",
    value: "0",
    description: "Total number of documents processed",
    icon: FileText,
  },
  {
    title: "Total Users",
    value: "0",
    description: "Total number of registered users",
    icon: Users,
  },
  {
    title: "Analytics",
    value: "0",
    description: "Total number of analytics reports",
    icon: BarChart3,
  },
] 