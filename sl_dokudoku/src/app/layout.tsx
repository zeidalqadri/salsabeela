import "@/styles/globals.css"
import { Inter } from "next/font/google"

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Providers } from "@/components/providers" // Combined providers likely includes SessionProvider, QueryProvider etc.
import { FolderProvider } from "@/providers/FolderContext" // Import FolderProvider
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DokuDoku",
  description: "Document management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {/* Assuming this wraps SessionProvider, QueryClientProvider */}
          <FolderProvider> {/* Wrap with FolderProvider */}
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <AppSidebar />
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <AppHeader /> {/* Add the header */}
              <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"> {/* Adjusted padding */}
                {children}
              </main>
            </div>
          </div>
          <Toaster />
          </FolderProvider> {/* Close FolderProvider */}
        </Providers>
      </body>
    </html>
  )
}
