import type { Task, TaskStats } from '../types'

export function todayDateKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isOverdue(task: Task): boolean {
  if (task.status === 'Done') return false
  return task.deadline < todayDateKey()
}

export function getStats(tasks: Task[]): TaskStats {
  const total = tasks.length
  let todo = 0
  let inProgress = 0
  let done = 0
  let overdue = 0
  const byPriority: TaskStats['byPriority'] = { Low: 0, Medium: 0, High: 0 }

  for (const task of tasks) {
    if (task.status === 'Todo') todo += 1
    else if (task.status === 'In Progress') inProgress += 1
    else done += 1

    if (task.priority === 'Low') byPriority.Low += 1
    else if (task.priority === 'Medium') byPriority.Medium += 1
    else byPriority.High += 1

    if (isOverdue(task)) overdue += 1
  }

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100)

  return {
    total,
    todo,
    inProgress,
    done,
    overdue,
    completionRate,
    byPriority: { Low: byPriority.Low, Medium: byPriority.Medium, High: byPriority.High },
  }
}

export function formatDeadline(dateString: string): string {
  const [y, m, d] = dateString.split('-').map(Number)
  if (!y || !m || !d) return dateString
  const date = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function generateId(): string {
  return crypto.randomUUID()
}
