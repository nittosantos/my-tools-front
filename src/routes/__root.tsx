import { createRootRoute, Outlet, Link } from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { ThemeProvider } from "next-themes"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

