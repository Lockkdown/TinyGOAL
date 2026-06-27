import type { CompletionPoint, PomodoroSession, Task, TaskStats } from '../types'

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

export function formatCompletedAt(isoTimestamp: string): string {
  const d = new Date(isoTimestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return formatDeadline(`${y}-${m}-${day}`)
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const mm = Math.floor(totalSeconds / 60)
  const ss = totalSeconds % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toLocalDateKey(isoTimestamp: string): string {
  return toDateKey(new Date(isoTimestamp))
}

function startOfWeekMonday(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0)
  const dayOfWeek = date.getDay()
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  date.setDate(date.getDate() + offset)
  return date
}

export function getCompletionSeries(tasks: Task[], days = 7): CompletionPoint[] {
  const today = new Date()
  const dateKeys: string[] = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dateKeys.push(toDateKey(d))
  }

  const counts = new Map<string, number>()
  for (const key of dateKeys) {
    counts.set(key, 0)
  }

  for (const task of tasks) {
    if (!task.completedAt) continue
    const key = toLocalDateKey(task.completedAt)
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return dateKeys.map((date, index) => {
    const isToday = index === dateKeys.length - 1
    const label = isToday ? 'Today' : String(new Date(date + 'T12:00:00').getDate())
    return { label, date, count: counts.get(date) ?? 0 }
  })
}

export function getCompletionWeekSeries(tasks: Task[], weeks = 8): CompletionPoint[] {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const thisMonday = startOfWeekMonday(today)

  const buckets: { start: Date; end: Date; label: string; date: string }[] = []

  for (let i = weeks - 1; i >= 0; i -= 1) {
    const start = new Date(thisMonday)
    start.setDate(thisMonday.getDate() - i * 7)
    const isCurrentWeek = i === 0
    const end = isCurrentWeek
      ? today
      : new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 12, 0, 0, 0)
    const label = isCurrentWeek
      ? 'This wk'
      : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(start)

    buckets.push({ start, end, label, date: toDateKey(start) })
  }

  const counts = buckets.map(() => 0)

  for (const task of tasks) {
    if (!task.completedAt) continue
    const completed = new Date(task.completedAt)
    completed.setHours(12, 0, 0, 0)

    for (let i = 0; i < buckets.length; i += 1) {
      const { start, end } = buckets[i]
      if (completed >= start && completed <= end) {
        counts[i] += 1
        break
      }
    }
  }

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    date: bucket.date,
    count: counts[index],
  }))
}

/** Focus minutes per day for the last N days. CompletionPoint.count = minutes (not session count). */
export function getFocusSeries(sessions: PomodoroSession[], days = 7): CompletionPoint[] {
  const today = new Date()
  const dateKeys: string[] = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dateKeys.push(toDateKey(d))
  }

  const minutesByDate = new Map<string, number>()
  for (const key of dateKeys) {
    minutesByDate.set(key, 0)
  }

  for (const session of sessions) {
    if (minutesByDate.has(session.date)) {
      minutesByDate.set(session.date, (minutesByDate.get(session.date) ?? 0) + session.minutes)
    }
  }

  return dateKeys.map((date, index) => {
    const isToday = index === dateKeys.length - 1
    const label = isToday ? 'Today' : String(new Date(date + 'T12:00:00').getDate())
    return { label, date, count: minutesByDate.get(date) ?? 0 }
  })
}

export function getFocusTodayStats(
  sessions: PomodoroSession[],
): { sessions: number; minutes: number } {
  const key = todayDateKey()
  let count = 0
  let minutes = 0
  for (const session of sessions) {
    if (session.date === key) {
      count += 1
      minutes += session.minutes
    }
  }
  return { sessions: count, minutes }
}

export type CalendarCell = {
  key: string
  day: number
  inMonth: boolean
  isToday: boolean
}

/** 6×7 grid, week starts Monday. Local-safe — no new Date(string). */
export function getCalendarMatrix(year: number, month: number): CalendarCell[][] {
  const today = todayDateKey()
  const firstOfMonth = new Date(year, month, 1)
  const jsDay = firstOfMonth.getDay()
  const offset = jsDay === 0 ? 6 : jsDay - 1
  const gridStart = new Date(year, month, 1 - offset)

  const weeks: CalendarCell[][] = []
  for (let w = 0; w < 6; w += 1) {
    const row: CalendarCell[] = []
    for (let d = 0; d < 7; d += 1) {
      const cur = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + w * 7 + d,
      )
      const key = toDateKey(cur)
      row.push({
        key,
        day: cur.getDate(),
        inMonth: cur.getMonth() === month,
        isToday: key === today,
      })
    }
    weeks.push(row)
  }
  return weeks
}

export function groupTasksByDeadline(tasks: Task[]): Map<string, Task[]> {
  const map = new Map<string, Task[]>()
  for (const task of tasks) {
    const list = map.get(task.deadline)
    if (list) list.push(task)
    else map.set(task.deadline, [task])
  }
  return map
}
