'use client'

import { RoleList } from '@/components/role-list'

// Example data - in a real app, this would come from your API
const roles = [
  {
    id: 'r1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      {
        id: 'p1',
        name: 'manage_users',
        description: 'Create, update, and delete users'
      },
      {
        id: 'p2',
        name: 'manage_documents',
        description: 'Full access to all documents'
      },
      {
        id: 'p3',
        name: 'manage_roles',
        description: 'Manage user roles and permissions'
      }
    ]
  },
  {
    id: 'r2',
    name: 'Editor',
    description: 'Can edit and manage documents',
    permissions: [
      {
        id: 'p2',
        name: 'manage_documents',
        description: 'Full access to all documents'
      }
    ]
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access to documents',
    permissions: [
      {
        id: 'p4',
        name: 'view_documents',
        description: 'View documents only'
      }
    ]
  }
]

const availablePermissions = [
  {
    id: 'p1',
    name: 'manage_users',
    description: 'Create, update, and delete users'
  },
  {
    id: 'p2',
    name: 'manage_documents',
    description: 'Full access to all documents'
  },
  {
    id: 'p3',
    name: 'manage_roles',
    description: 'Manage user roles and permissions'
  },
  {
    id: 'p4',
    name: 'view_documents',
    description: 'View documents only'
  }
]

export default function AdminPage() {
  const handleRoleAdd = (role: any) => {
    console.log('Adding role:', role)
    // In a real app, you would make an API call here
  }

  const handleRoleEdit = (roleId: string, role: any) => {
    console.log('Editing role:', roleId, role)
    // In a real app, you would make an API call here
  }

  const handleRoleDelete = (roleId: string) => {
    console.log('Deleting role:', roleId)
    // In a real app, you would make an API call here
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="max-w-4xl">
        <RoleList
          roles={roles}
          availablePermissions={availablePermissions}
          onRoleAdd={handleRoleAdd}
          onRoleEdit={handleRoleEdit}
          onRoleDelete={handleRoleDelete}
        />
      </div>
    </div>
  )
} 