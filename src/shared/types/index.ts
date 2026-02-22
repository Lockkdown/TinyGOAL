export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export type TaskStatus = "BACKLOG" | "TODAY" | "IN_PROGRESS" | "DONE" | "CANCELLED"
