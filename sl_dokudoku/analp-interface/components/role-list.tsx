"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash, Users, Shield } from "lucide-react"

export function RoleList() {
  // Mock role data
  const roles = [
    {
      id: "role-001",
      name: "Administrator",
      description: "Full system access with all permissions",
      users: 2,
      permissions: [
        "View Documents",
        "Upload Documents",
        "Edit Documents",
        "Delete Documents",
        "View Analytics",
        "Export Analytics",
        "Manage Users",
        "Manage Roles",
        "Manage Sources",
        "Configure System",
        "API Access",
      ],
    },
    {
      id: "role-002",
      name: "Manager",
      description: "Access to manage documents and view analytics",
      users: 5,
      permissions: [
        "View Documents",
        "Upload Documents",
        "Edit Documents",
        "Delete Documents",
        "View Analytics",
        "Export Analytics",
        "Manage Sources",
      ],
    },
    {
      id: "role-003",
      name: "Analyst",
      description: "Access to view documents and analytics",
      users: 8,
      permissions: ["View Documents", "Upload Documents", "View Analytics", "Export Analytics"],
    },
    {
      id: "role-004",
      name: "Standard User",
      description: "Basic access to view and upload documents",
      users: 15,
      permissions: ["View Documents", "Upload Documents", "Edit Own Documents"],
    },
    {
      id: "role-005",
      name: "Read-Only User",
      description: "View-only access to documents",
      users: 10,
      permissions: ["View Documents"],
    },
  ]

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div key={role.id} className="border rounded-md">
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{role.name}</h3>
                <Badge variant="outline">{role.users} users</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    View Users
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Clone Role
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

