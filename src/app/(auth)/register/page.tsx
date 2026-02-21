import Link from "next/link"
import { RegisterForm } from "@/features/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started with TinyGOAL today</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
