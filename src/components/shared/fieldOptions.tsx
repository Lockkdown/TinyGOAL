import type { Category, Priority, Status } from '../../types'

export const STATUS_OPTIONS: readonly Status[] = ['Todo', 'In Progress', 'Done'] as const

export const PRIORITY_OPTIONS: readonly Priority[] = ['Low', 'Medium', 'High'] as const

export const CATEGORY_OPTIONS: readonly Category[] = ['Work', 'Personal', 'Study', 'Other'] as const

export const FOCUS_MINUTES_OPTIONS = [15, 20, 25, 30, 45, 60] as const

export const BREAK_MINUTES_OPTIONS = [5, 10, 15] as const
