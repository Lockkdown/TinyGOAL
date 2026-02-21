import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import type { ApiResponse } from "@/shared/types"
import type { Task } from "@/entities/task"

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["BACKLOG", "TODAY", "IN_PROGRESS", "DONE", "CANCELLED"]).optional(),
  priority: z.number().int().optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
  completedAt: z.string().datetime({ offset: true }).nullable().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

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

async function getOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({ where: { id: taskId, userId } })
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const task = await getOwnedTask(id, session.user.id)

    if (!task) {
      return NextResponse.json({ data: null, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ data: serializeTask(task), error: null })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await getOwnedTask(id, session.user.id)
    if (!existing) {
      return NextResponse.json({ data: null, error: "Task not found" }, { status: 404 })
    }

    const body: unknown = await request.json()
    const validated = updateTaskSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { data: null, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { dueDate, completedAt, ...rest } = validated.data

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(completedAt !== undefined && {
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
      },
    })

    return NextResponse.json({ data: serializeTask(updated), error: null })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await getOwnedTask(id, session.user.id)
    if (!existing) {
      return NextResponse.json({ data: null, error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({ where: { id } })

    return NextResponse.json({ data: { id }, error: null })
  } catch {
    return NextResponse.json({ data: null, error: "Internal server error" }, { status: 500 })
  }
}
