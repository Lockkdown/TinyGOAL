# 🧠 SPEC CONTEXT — TASK MANAGER "LOCKDOWN"

> Mục đích: Định nghĩa chính xác tên biến, tên hàm, tên type, tên prop — AI phải dùng đúng tên này, không tự đặt tên khác
> Rule: Bất kỳ tên nào chưa có trong file này → hỏi Lockdown trước khi đặt
> Cập nhật: 10/05/2026 — Tailwind thay CSS thuần, bỏ BEM class names

---

## 📦 TYPES (`src/types/index.ts`)

```ts
type Category = 'Work' | 'Personal' | 'Study' | 'Other'
type Priority = 'Low' | 'Medium' | 'High'
type Status = 'Todo' | 'In Progress' | 'Done'

type Task = {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  status: Status
  deadline: string      // ISO date string: "2026-05-16"
  createdAt: string     // ISO date string: "2026-05-09T10:00:00.000Z"
}

type TaskStats = {
  total: number
  todo: number
  inProgress: number
  done: number
  overdue: number
  completionRate: number   // 0-100, đơn vị %
  byPriority: {
    Low: number
    Medium: number
    High: number
  }
}

type FilterState = {
  search: string
  category: Category | 'All'
  priority: Priority | 'All'
  status: Status | 'All'
}
```

---

## 🪝 HOOKS

### `useTasks` (`src/hooks/useTasks.ts`)

```ts
// State
tasks: Task[]
filteredTasks: Task[]
filters: FilterState

// CRUD Actions
addTask(task: Omit<Task, 'id' | 'createdAt'>): void
updateTask(id: string, updates: Partial<Task>): void
deleteTask(id: string): void
moveTask(id: string, newStatus: Status): void

// Filter Actions
setSearch(value: string): void
setFilter(key: keyof FilterState, value: string): void
clearFilters(): void
```

### `useLocalStorage` (`src/hooks/useLocalStorage.ts`)

```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]

// Dùng trong useTasks:
const [tasks, setTasks] = useLocalStorage<Task[]>('tinygoal-tasks', [])
```

**LocalStorage key:** `'tinygoal-tasks'` — không đổi tên này

---

## 🧩 COMPONENTS & PROPS

### `Board.tsx`
```ts
type BoardProps = {
  filteredTasks: Task[]
  moveTask: (id: string, newStatus: Status) => void
  deleteTask: (id: string) => void
  onEditTask: (task: Task) => void
}
// Props từ App (một `useTasks()` ở App); Board chỉ render cột.
```

### `Column.tsx`
```ts
type ColumnProps = {
  status: Status
  tasks: Task[]
  onMoveTask: (id: string, newStatus: Status) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}
```

### `TaskCard.tsx`
```ts
type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, newStatus: Status) => void
}
```

### `TaskForm.tsx`
```ts
type TaskFormProps = {
  initialData?: Task          // có → edit mode, không có → add mode
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}
```

### `Modal.tsx`
```ts
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}
```

### `SearchBar.tsx`
```ts
type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}
```

### `FilterBar.tsx`
```ts
type FilterBarProps = {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onClearFilters: () => void
}
```

### `Dashboard.tsx`
```ts
type DashboardProps = {
  stats: TaskStats
}
```

---

## 🛠️ UTILS (`src/utils/helpers.ts`)

```ts
export function todayDateKey(): string // YYYY-MM-DD local; form default deadline + isOverdue

export function isOverdue(task: Task): boolean
// Logic: task.deadline < today && task.status !== 'Done'

function getStats(tasks: Task[]): TaskStats

function formatDeadline(dateString: string): string
// Output: "16 May 2026"

function generateId(): string
// Dùng: crypto.randomUUID()
```

---

## 🎨 TAILWIND COLOR MAP (dùng thay BEM modifier)

```ts
// Priority badge colors
const PRIORITY_CLASSES: Record<Priority, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
}

// Status column header colors
const STATUS_CLASSES: Record<Status, string> = {
  'Todo': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-600',
  'Done': 'bg-green-100 text-green-600',
}

// Overdue deadline text
const OVERDUE_CLASS = 'text-red-500 font-medium'
```

> Các map này đặt trong file component dùng nó, hoặc export từ `utils/helpers.ts` nếu dùng nhiều chỗ.

---

## 📌 APP STATE (App.tsx)

```ts
const [isFormOpen, setIsFormOpen] = useState(false)
const [editingTask, setEditingTask] = useState<Task | null>(null)

function handleAddTask(): void
function handleEditTask(task: Task): void
function handleCloseForm(): void
```

---

## ⚠️ QUY TẮC ĐẶT TÊN CHO AI

- **Tên hàm**: camelCase — `addTask`, `deleteTask`, `isOverdue`
- **Tên type**: PascalCase — `Task`, `TaskStats`, `FilterState`
- **Tên component**: PascalCase — `TaskCard`, `FilterBar`
- **Tên file component**: PascalCase — `TaskCard.tsx`
- **Tên file hook**: camelCase với prefix `use` — `useTasks.ts`
- **LocalStorage key**: prefix `tinygoal-` — `tinygoal-tasks`
- **KHÔNG dùng** `any`, `object`, hoặc type không rõ ràng
- **KHÔNG viết** CSS class tay — chỉ dùng Tailwind utilities
