import type { ReactNode } from "react"
import { APP_NAME, APP_DESCRIPTION } from "@/shared/config/constants"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {APP_DESCRIPTION}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
