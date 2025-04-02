import { useSession } from "next-auth/react"

export type Permission = "VIEW" | "EDIT" | "DELETE" | "SHARE"
export type Resource = "DOCUMENT" | "FOLDER" | "TAG"

interface RBACConfig {
  resource: Resource
  permission: Permission
  ownerId?: string
}

export function useRBAC({ resource, permission, ownerId }: RBACConfig) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  if (!session || !userId) {
    return false
  }

  // Admin has all permissions
  if (session.user?.role === "ADMIN") {
    return true
  }

  // Owner has all permissions on their resources
  if (ownerId && userId === ownerId) {
    return true
  }

  // Default permissions based on resource type
  switch (resource) {
    case "DOCUMENT":
      return permission === "VIEW" // Non-owners can only view documents they have access to
    case "FOLDER":
      return ["VIEW", "EDIT"].includes(permission) // Users can view and edit folders
    case "TAG":
      return ["VIEW", "EDIT"].includes(permission) // Users can view and edit tags
    default:
      return false
  }
} 