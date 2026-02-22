"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface RegisterPayload {
  email: string
  password: string
  name: string
}

interface UseRegisterReturn {
  isLoading: boolean
  register: (payload: RegisterPayload) => Promise<void>
}

async function postRegister(payload: RegisterPayload): Promise<{ error: string | null }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const json: { error?: string } = await res.json()
  return { error: json.error ?? null }
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function register(payload: RegisterPayload): Promise<void> {
    setIsLoading(true)

    const { error } = await postRegister(payload)
    if (error) {
      toast.error(error)
      setIsLoading(false)
      return
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Account created but sign-in failed. Please sign in manually.")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return { isLoading, register }
}
