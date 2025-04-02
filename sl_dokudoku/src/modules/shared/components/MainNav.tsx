"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Upload,
  Search,
  BarChart,
  Database,
  Key,
  Users,
  Settings
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText
  },
  {
    title: "Upload",
    href: "/upload",
    icon: Upload
  },
  {
    title: "Search",
    href: "/search",
    icon: Search
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart
  }
]

const adminNavItems = [
  {
    title: "Document Sources",
    href: "/sources",
    icon: Database
  },
  {
    title: "API Access",
    href: "/api-access",
    icon: Key
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Navigation
        </h2>
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>
        <div className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 