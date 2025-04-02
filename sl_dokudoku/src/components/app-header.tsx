'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Import Button
import { Search, LogIn, LogOut, User } from 'lucide-react' // Import icons
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react" // Import NextAuth hooks
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import Dropdown components

export function AppHeader() {
  const { data: session, status } = useSession() // Get session status
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedSearchTerm = searchTerm.trim()
    if (trimmedSearchTerm) {
      console.log('Navigating to search results for:', trimmedSearchTerm)
      // Navigate to a dedicated search results page (page needs to be created later)
      router.push(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`)
      // Optionally clear search term after navigation
      // setSearchTerm(''); 
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
      {/* Placeholder for potential mobile nav toggle */}
      {/* <Button size="icon" variant="outline" className="sm:hidden">
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button> */}
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <form onSubmit={handleSearchSubmit}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      
      {/* User Menu / Login Button */}
      <div className="ml-auto">
        {status === "loading" && (
          <Button variant="ghost" size="icon" disabled>
            <User className="h-5 w-5 animate-spin" /> 
          </Button>
        )}
        {status === "unauthenticated" && (
          <Button variant="outline" onClick={() => signIn()}> {/* Sign in using default NextAuth page */}
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        )}
        {status === "authenticated" && session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {/* TODO: Use user image if available */}
                <User className="h-5 w-5" /> 
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {/* TODO: Link to profile/settings page */}
                Settings 
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}> {/* Sign out */}
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
