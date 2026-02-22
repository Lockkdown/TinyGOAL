import type { Task, CreateTaskInput, UpdateTaskInput } from "@/entities/task"
import type { ApiResponse } from "@/shared/types"

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json()
  if (json.error) throw new Error(json.error)
  if (json.data === null) throw new Error("No data returned")
  return json.data
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks")
  return handleResponse<Task[]>(res)
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<Task>(res)
}

export async function updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse<Task>(res)
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
  await handleResponse<{ id: string }>(res)
}
