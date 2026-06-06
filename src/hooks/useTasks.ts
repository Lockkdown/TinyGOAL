import { useCallback, useEffect, useRef } from 'react'
import type { Status, Task } from '../types'
import { generateId } from '../utils/helpers'
import { useLocalStorage } from './useLocalStorage'

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
      }
      const next = [...tasksRef.current, newTask]
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const next = tasksRef.current.map((t) => (t.id === id ? { ...t, ...updates } : t))
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
        t.id === id ? { ...t, status: newStatus } : t,
      )
      tasksRef.current = next
      setTasks(next)
    },
    [setTasks],
  )

  const toggleDone = useCallback(
    (id: string) => {
      const next = tasksRef.current.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === 'Done' ? 'Todo' : 'Done') as Status }
          : t,
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
    toggleDone,
  }
}
