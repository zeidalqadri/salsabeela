"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Folder, Settings, Users } from "lucide-react" // Add Folder icon
import { FolderTree } from "@/components/FolderTree" // Import FolderTree
import { useFolderContext } from "@/providers/FolderContext" // Import the context hook

import {
  SidebarNav,
  SidebarNavContent,
  SidebarNavFooter,
  SidebarNavGroup,
  SidebarNavGroupContent,
  SidebarNavGroupLabel,
  SidebarNavHeader,
  SidebarNavMenu,
  SidebarNavMenuButton,
  SidebarNavProvider,
  SidebarNavSeparator,
} from "@/components/ui/sidebar-nav"

export function AppSidebar() {
  const pathname = usePathname()
  const { selectedFolderId, setSelectedFolderId } = useFolderContext(); // Use the context

  return (
    <SidebarNavProvider>
      <SidebarNav>
        <SidebarNavHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>DokuDoku</span>
          </Link>
        </SidebarNavHeader>
        <SidebarNavContent>
          <SidebarNavGroup>
            <SidebarNavGroupLabel>Overview</SidebarNavGroupLabel>
            <SidebarNavGroupContent>
              <SidebarNavMenu>
                <Link href="/dashboard">
                  <SidebarNavMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                  >
                    <span>
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </span>
                  </SidebarNavMenuButton>
                </Link>
                <Link href="/documents">
                  <SidebarNavMenuButton
                    asChild
                    isActive={pathname === "/documents"}
                  >
                    <span>
                      <FileText className="h-4 w-4" />
                      <span>Documents</span>
                    </span>
                  </SidebarNavMenuButton>
                </Link>
                <Link href="/users">
                  <SidebarNavMenuButton
                    asChild
                    isActive={pathname === "/users"}
                  >
                    <span>
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </span>
                  </SidebarNavMenuButton>
                </Link>
              </SidebarNavMenu>
            </SidebarNavGroupContent>
          </SidebarNavGroup>
          <SidebarNavSeparator />
          {/* Folder Navigation Group */}
          <SidebarNavGroup>
            <SidebarNavGroupLabel>Folders</SidebarNavGroupLabel>
            <SidebarNavGroupContent>
              {/* Render the FolderTree component (no props needed now) */}
              <FolderTree />
            </SidebarNavGroupContent>
          </SidebarNavGroup>
          <SidebarNavSeparator />
          <SidebarNavGroup>
            <SidebarNavGroupLabel>Settings</SidebarNavGroupLabel>
            <SidebarNavGroupContent>
              <SidebarNavMenu>
                <Link href="/settings">
                  <SidebarNavMenuButton
                    asChild
                    isActive={pathname === "/settings"}
                  >
                    <span>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </span>
                  </SidebarNavMenuButton>
                </Link>
              </SidebarNavMenu>
            </SidebarNavGroupContent>
          </SidebarNavGroup>
        </SidebarNavContent>
        <SidebarNavFooter>
          <div className="p-4">
            <p className="text-xs text-muted-foreground">
              © 2024 DokuDoku. All rights reserved.
            </p>
          </div>
        </SidebarNavFooter>
      </SidebarNav>
    </SidebarNavProvider>
  )
}
