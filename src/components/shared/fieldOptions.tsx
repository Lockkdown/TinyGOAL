import type { Category, Priority, Status } from '../../types'

export const STATUS_OPTIONS: readonly Status[] = ['Todo', 'In Progress', 'Done'] as const

export const PRIORITY_OPTIONS: readonly Priority[] = ['Low', 'Medium', 'High'] as const

export const CATEGORY_OPTIONS: readonly Category[] = ['Work', 'Personal', 'Study', 'Other'] as const
