export type TaskStatus = "BACKLOG" | "TODAY" | "IN_PROGRESS" | "DONE" | "CANCELLED"

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: number
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  userId: string
  categoryId: string | null
  parentId: string | null
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: number
  dueDate?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: number
  dueDate?: string | null
  completedAt?: string | null
}

export interface DailyPlan {
  id: string
  date: string
  note: string | null
  userId: string
  createdAt: string
  updatedAt: string
  items: DailyPlanItem[]
}

export interface DailyPlanItem {
  id: string
  order: number
  dailyPlanId: string
  taskId: string
  task?: Task
}
