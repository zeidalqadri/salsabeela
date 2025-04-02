import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function withAuth<T>(Component: React.ComponentType<T>) {
  return async function AuthenticatedComponent(props: T) {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/login")
    }

    return <Component {...props} />
  }
} 