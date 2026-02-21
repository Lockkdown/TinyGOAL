"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/task.api"
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/entities/task"

interface UseTasksReturn {
  tasks: Task[]
  isLoading: boolean
  hasError: boolean
  addTask: (data: CreateTaskInput) => Promise<void>
  editTask: (id: string, data: UpdateTaskInput) => Promise<void>
  removeTask: (id: string) => Promise<void>
  reorderTasks: (reordered: Task[]) => void
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setHasError(false)
      const data = await fetchTasks()
      setTasks(data)
    } catch {
      setHasError(true)
      toast.error("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function addTask(data: CreateTaskInput): Promise<void> {
    try {
      const task = await createTask(data)
      setTasks((prev) => [...prev, task])
      toast.success("Task created")
    } catch {
      toast.error("Failed to create task")
    }
  }

  async function editTask(id: string, data: UpdateTaskInput): Promise<void> {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
    try {
      const updated = await updateTask(id, data)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch {
      setTasks(previous)
      toast.error("Failed to update task")
    }
  }

  async function removeTask(id: string): Promise<void> {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTask(id)
      toast.success("Task deleted")
    } catch {
      setTasks(previous)
      toast.error("Failed to delete task")
    }
  }

  function reorderTasks(reordered: Task[]): void {
    setTasks(reordered)
  }

  return { tasks, isLoading, hasError, addTask, editTask, removeTask, reorderTasks }
}
