import type { ReactNode } from 'react'

export type Category = 'Work' | 'Personal' | 'Study' | 'Other'

export type Priority = 'Low' | 'Medium' | 'High'

export type Status = 'Todo' | 'In Progress' | 'Done'

export type Task = {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  status: Status
  deadline: string
  createdAt: string
}

export type TaskStats = {
  total: number
  todo: number
  inProgress: number
  done: number
  overdue: number
  completionRate: number
  byPriority: {
    Low: number
    Medium: number
    High: number
  }
}

export type ColumnProps = {
  status: Status
  tasks: Task[]
  onMoveTask: (id: string, newStatus: Status) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, newStatus: Status) => void
}

export type BoardProps = {
  tasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  deleteTask: (id: string) => void
  onEditTask: (task: Task) => void
}

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export type TaskFormProps = {
  initialData?: Task
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export type DashboardProps = {
  stats: TaskStats
}
