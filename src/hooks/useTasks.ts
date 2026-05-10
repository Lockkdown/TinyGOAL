import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FilterState, Status, Task } from '../types'
import { generateId } from '../utils/helpers'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: 'All',
  priority: 'All',
  status: 'All',
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tinygoal-tasks', [])
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const tasksRef = useRef(tasks)

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (
        q !== '' &&
        !task.title.toLowerCase().includes(q) &&
        !task.description.toLowerCase().includes(q)
      ) {
        return false
      }
      if (filters.category !== 'All' && task.category !== filters.category) return false
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false
      if (filters.status !== 'All' && task.status !== filters.status) return false
      return true
    })
  }, [tasks, filters])

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

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }))
  }, [])

  const setFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      if (key === 'search') return { ...prev, search: value }
      if (key === 'category') return { ...prev, category: value as FilterState['category'] }
      if (key === 'priority') return { ...prev, priority: value as FilterState['priority'] }
      return { ...prev, status: value as FilterState['status'] }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS })
  }, [])

  return {
    tasks,
    filteredTasks,
    filters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    setSearch,
    setFilter,
    clearFilters,
  }
}
