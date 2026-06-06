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
  onAddTask: () => void
  onOpenTask: (task: Task) => void
}

export type TaskCardProps = {
  task: Task
  onOpenTask: (task: Task) => void
  isOverlay?: boolean
}

export type BoardProps = {
  tasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  onAddTask: () => void
  onOpenTask: (task: Task) => void
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

export type ActiveView = 'task' | 'statistic'

export type BoardLayout = 'board' | 'list'

export type SidebarProps = {
  activeView: ActiveView
  onChangeView: (view: ActiveView) => void
  isCollapsed: boolean
  onToggleCollapsed: () => void
}

export type TaskViewProps = {
  tasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  onAddTask: () => void
  onOpenTask: (task: Task) => void
  boardLayout: BoardLayout
  onChangeBoardLayout: (layout: BoardLayout) => void
}

export type ListViewProps = {
  tasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  onAddTask: () => void
  onOpenTask: (task: Task) => void
}

export type TaskListItemProps = {
  task: Task
  isOverlay?: boolean
  onOpenTask: (task: Task) => void
}

export type BoardViewProps = {
  tasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  onAddTask: () => void
  onOpenTask: (task: Task) => void
}

export type DashboardViewProps = {
  tasks: Task[]
}

export type TaskDetailPanelProps = {
  task: Task | null
  onClose: () => void
  onSave: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}
