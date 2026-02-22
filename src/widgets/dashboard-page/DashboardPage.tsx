"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { APP_NAME } from "@/shared/config/constants"
import { TaskBoard } from "@/widgets/task-board"

export function DashboardPage() {
  const { data: session } = useSession()

  function handleSignOut(): void {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
          <h1 className="font-bold text-lg tracking-tight">{APP_NAME}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.name ?? session?.user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <TaskBoard />
      </main>
    </div>
  )
}
