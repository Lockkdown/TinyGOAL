import { useCallback, useEffect, useRef } from 'react'
import type { Status, Task } from '../types'
import { generateId } from '../utils/helpers'
import { useLocalStorage } from './useLocalStorage'

function withCompletedAt(prev: Task, nextStatus: Status): Pick<Task, 'completedAt'> {
  const wasDone = prev.status === 'Done'
  const isDone = nextStatus === 'Done'
  if (isDone && !wasDone) return { completedAt: new Date().toISOString() }
  if (!isDone && wasDone) return { completedAt: null }
  return { completedAt: prev.completedAt ?? null }
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tinygoal-tasks', [])
  const tasksRef = useRef(tasks)

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
        completedAt: null,
      }
      const next = [...tasksRef.current, newTask]
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const next = tasksRef.current.map((t) => {
        if (t.id !== id) return t
        if (updates.status !== undefined) {
          return { ...t, ...updates, ...withCompletedAt(t, updates.status) }
        }
        return { ...t, ...updates }
      })
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      const next = tasksRef.current.filter((t) => t.id !== id)
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  const moveTask = useCallback(
    (id: string, newStatus: Status) => {
      const next = tasksRef.current.map((t) =>
        t.id === id ? { ...t, status: newStatus, ...withCompletedAt(t, newStatus) } : t,
      )
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  }
}
