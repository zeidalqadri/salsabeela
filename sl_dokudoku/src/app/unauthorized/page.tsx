import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldX } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Unauthorized - DokuDoku",
  description: "You don't have permission to access this resource",
}

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-md px-4 py-8 text-center">
        <div className="mb-6 flex justify-center">
          <ShieldX className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          You don't have permission to access this page. This area requires elevated privileges.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/documents">
              Your Documents
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 