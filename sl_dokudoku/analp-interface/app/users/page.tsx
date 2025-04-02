"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Trash, UserPlus, Shield, Mail, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { UserList } from "@/components/user-list"
import { RoleList } from "@/components/role-list"

export default function UsersPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button onClick={() => setActiveTab("add-user")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="add-user">Add User</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>Manage users and their access to the system</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search users..." className="pl-8 w-full md:w-[250px]" />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <UserList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage roles and their associated permissions</CardDescription>
                </div>
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RoleList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="analyst">Analyst</option>
                    <option value="user">Standard User</option>
                    <option value="readonly">Read-Only User</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Engineering" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="send-invitation" defaultChecked />
                  <Label htmlFor="send-invitation">Send email invitation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="require-password-change" defaultChecked />
                  <Label htmlFor="require-password-change">Require password change on first login</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("users")}>
                    Cancel
                  </Button>
                  <Button>Create User</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>Manage pending user invitations</CardDescription>
                </div>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Bulk Invitations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Invited By</div>
                  <div className="col-span-2">Date Sent</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                  <div className="col-span-4">
                    <span className="font-medium">sarah.johnson@example.com</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">Analyst</Badge>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">John Doe</div>
                  <div className="col-span-2 text-sm text-muted-foreground">2023-03-15</div>
                  <div className="col-span-2 text-right">
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
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          Cancel Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                  <div className="col-span-4">
                    <span className="font-medium">michael.brown@example.com</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">Manager</Badge>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">John Doe</div>
                  <div className="col-span-2 text-sm text-muted-foreground">2023-03-14</div>
                  <div className="col-span-2 text-right">
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
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          Cancel Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-4">
                    <span className="font-medium">emily.wilson@example.com</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">Standard User</Badge>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">Jane Doe</div>
                  <div className="col-span-2 text-sm text-muted-foreground">2023-03-10</div>
                  <div className="col-span-2 text-right">
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
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          Cancel Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

