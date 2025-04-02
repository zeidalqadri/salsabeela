import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="mt-2 text-muted-foreground">
        Manage users and their permissions. Add new users or modify existing ones.
      </p>
    </div>
  )
} 