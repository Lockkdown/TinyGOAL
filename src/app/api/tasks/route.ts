import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/shared/config/constants"
import type { ApiResponse } from "@/shared/types"
import { TASK_STATUS_VALUES } from "@/entities/task"
import type { Task } from "@/entities/task"

function serializeTask(task: {
  id: string
  title: string
  description: string | null
  status: string
  priority: number
  dueDate: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
  categoryId: string | null
  parentId: string | null
}): Task {
  return {
    ...task,
    status: task.status as Task["status"],
    dueDate: task.dueDate?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  status: z.enum(TASK_STATUS_VALUES).optional(),
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

    const serialized = tasks.map(serializeTask)

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

    return NextResponse.json({ data: serializeTask(task), error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
