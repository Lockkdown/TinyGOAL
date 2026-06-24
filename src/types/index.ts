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
  completedAt?: string | null
  pomodoroCount?: number
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

export type CompletionPoint = {
  label: string
  date: string
  count: number
}

export type DashboardProps = {
  stats: TaskStats
  tasks: Task[]
}

export type AppTheme = 'light' | 'dark'

export type ActiveView = 'task' | 'statistic' | 'focus'

export type PomodoroPhaseStatus = 'idle' | 'running' | 'finished'

export type PomodoroPhase = 'focus' | 'break'

export type PomodoroConfig = {
  focusMinutes: number
  breakMinutes: number
}

export type PomodoroSession = {
  date: string
  /** Actual focus minutes completed for this session (not break) */
  minutes: number
  taskId: string | null
}

export type CountdownControls = {
  remainingMs: number
  status: PomodoroPhaseStatus
  start: () => void
  reset: () => void
}

export type BoardLayout = 'board' | 'list'

export type SidebarProps = {
  activeView: ActiveView
  onChangeView: (view: ActiveView) => void
  isCollapsed: boolean
  onToggleCollapsed: () => void
  onOpenSettings: () => void
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

export type FocusSettingsPanelProps = {
  config: PomodoroConfig
  onChange: (next: PomodoroConfig) => void
  onClose: () => void
}

export type FocusViewProps = {
  tasks: Task[]
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
  countdown: CountdownControls
  config: PomodoroConfig
  onConfigChange: (next: PomodoroConfig) => void
  phase: PomodoroPhase
  progress: number
  onSkipBreak: () => void
  onReset: () => void
}

export type TaskDetailPanelProps = {
  task: Task | null
  onClose: () => void
  onSave: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}
