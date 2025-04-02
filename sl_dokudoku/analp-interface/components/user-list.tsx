"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Trash, Key, Shield, Ban } from "lucide-react"

export function UserList() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock user data
  const users = [
    {
      id: "user-001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Administrator",
      department: "IT",
      status: "Active",
      lastLogin: "2023-03-15T10:30:00Z",
    },
    {
      id: "user-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Manager",
      department: "Engineering",
      status: "Active",
      lastLogin: "2023-03-14T14:45:00Z",
    },
    {
      id: "user-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Analyst",
      department: "Finance",
      status: "Active",
      lastLogin: "2023-03-12T09:15:00Z",
    },
    {
      id: "user-004",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      role: "Standard User",
      department: "Marketing",
      status: "Inactive",
      lastLogin: "2023-02-28T16:20:00Z",
    },
    {
      id: "user-005",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Read-Only User",
      department: "Sales",
      status: "Active",
      lastLogin: "2023-03-10T11:10:00Z",
    },
  ]

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "Inactive":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">{selectedUsers.length} user(s) selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
            <Button variant="outline" size="sm">
              <Ban className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
          <div className="col-span-1">
            <Checkbox
              checked={selectedUsers.length === users.length && users.length > 0}
              onCheckedChange={toggleSelectAll}
            />
          </div>
          <div className="col-span-3">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2 hidden md:block">Department</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 hidden md:block">Last Login</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center hover:bg-muted/30">
            <div className="col-span-1">
              <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleSelectUser(user.id)} />
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <Badge variant="outline">{user.role}</Badge>
            </div>
            <div className="col-span-2 hidden md:block text-sm text-muted-foreground">{user.department}</div>
            <div className="col-span-2">{getStatusBadge(user.status)}</div>
            <div className="col-span-1 hidden md:block text-sm text-muted-foreground">
              {new Date(user.lastLogin).toLocaleDateString()}
            </div>
            <div className="col-span-1 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.status === "Active" ? (
                    <DropdownMenuItem>
                      <Ban className="mr-2 h-4 w-4" />
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

