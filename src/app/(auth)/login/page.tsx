import Link from "next/link"
import { LoginForm } from "@/features/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
