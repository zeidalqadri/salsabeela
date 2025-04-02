'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Shield, MoreVertical, Plus, Trash, Edit } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

interface RoleListProps {
  roles: Role[]
  availablePermissions: Permission[]
  onRoleAdd?: (role: Omit<Role, 'id'>) => void
  onRoleEdit?: (roleId: string, role: Partial<Role>) => void
  onRoleDelete?: (roleId: string) => void
}

export function RoleList({
  roles,
  availablePermissions,
  onRoleAdd,
  onRoleEdit,
  onRoleDelete,
}: RoleListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[],
  })

  const handleAddRole = () => {
    onRoleAdd?.(newRole)
    setNewRole({
      name: '',
      description: '',
      permissions: [],
    })
    setIsAddDialogOpen(false)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold">User Roles</h3>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddRole} disabled={!newRole.name}>
                Add Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{role.name}</div>
                <div className="text-sm text-muted-foreground">
                  {role.description}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {role.permissions.length} permissions
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onRoleEdit?.(role.id, {
                        name: role.name,
                        description: role.description,
                      })
                    }
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onRoleDelete?.(role.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 