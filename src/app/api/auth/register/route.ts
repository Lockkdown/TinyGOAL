import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/shared/lib/prisma"
import type { ApiResponse } from "@/shared/types"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
})

type RegisteredUser = { id: string; email: string; name: string | null }

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<RegisteredUser>>> {
  try {
    const body: unknown = await request.json()
    const validated = registerSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { data: null, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name } = validated.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { data: null, error: "Email already in use" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name ?? null },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ data: user, error: null }, { status: 201 })
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    )
  }
}
