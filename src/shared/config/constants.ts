import type { TaskStatus } from "@/shared/types"

export const APP_NAME = "TinyGOAL"
export const APP_DESCRIPTION = "Personal task management for daily productivity"

export const MAX_TASKS_PER_DAY = 10
export const MAX_TITLE_LENGTH = 200
export const MAX_DESCRIPTION_LENGTH = 2000

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  TODAY: "Today",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
}

export const TASK_PRIORITY_LABELS: Record<number, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Urgent",
}
