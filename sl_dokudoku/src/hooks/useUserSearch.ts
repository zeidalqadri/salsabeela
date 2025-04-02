import { useQuery } from "@tanstack/react-query"
import { User } from "@prisma/client"

type UserSearchResult = Pick<User, "id" | "name" | "email" | "image">

async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query || query.length < 2) return []

  const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) {
    throw new Error("Failed to search users")
  }
  return response.json()
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["userSearch", query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
  })
} 