import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import type { User } from "@prisma/client"

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

type User = z.infer<typeof userSchema>

type UserBasic = Pick<User, "id" | "name" | "email">

async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users")
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

export function useUsers() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const createUser = useMutation({
    mutationFn: async (userData: { email: string; name?: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      return userSchema.parse(await response.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createUser: createUser.mutate,
    isCreating: createUser.isPending,
    createError: createUser.error,
  }
} 