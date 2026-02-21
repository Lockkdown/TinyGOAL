import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import type { ApiResponse } from "@/shared/types"
import type { Task } from "@/entities/task"

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["BACKLOG", "TODAY", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
  priority: z.number().int().optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
})

export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [{ status: "asc" }, { priority: "asc" }, { createdAt: "desc" }],
    })

    const serialized = tasks.map((t) => ({
      ...t,
      dueDate: t.dueDate?.toISOString() ?? null,
      completedAt: t.completedAt?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }))

    return NextResponse.json({ data: serialized, error: null })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validated = createTaskSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { data: null, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, description, status, priority, dueDate } = validated.data

    const maxPriorityTask = await prisma.task.findFirst({
      where: { userId: session.user.id },
      orderBy: { priority: "desc" },
      select: { priority: true },
    })

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        status: status ?? "BACKLOG",
        priority: priority ?? (maxPriorityTask ? maxPriorityTask.priority + 1 : 0),
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
      },
    })

    const serialized: Task = {
      ...task,
      dueDate: task.dueDate?.toISOString() ?? null,
      completedAt: task.completedAt?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }

    return NextResponse.json({ data: serialized, error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
