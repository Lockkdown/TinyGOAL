# TinyGOAL — Specification (Chức năng hiện tại)

> Cập nhật theo khảo sát codebase. Mô tả **những gì app đang làm được**, không phải kế hoạch tương lai.

---

## 1. Tổng quan

**TinyGOAL** là ứng dụng quản lý task cá nhân dạng Kanban, chạy hoàn toàn trên trình duyệt (SPA), lưu dữ liệu vào `localStorage`. Không có backend.

| Thuộc tính | Giá trị |
|------------|---------|
| Tên app | TinyGOAL |
| Phiên bản | 0.0.0 |
| Lưu trữ | `localStorage` key `tinygoal-tasks` |
| Views | Board (Kanban) · Dashboard (thống kê) |

---

## 2. Mô hình dữ liệu

### Task

| Field | Kiểu | Mô tả |
|-------|------|-------|
| `id` | `string` | UUID (`crypto.randomUUID()`) |
| `title` | `string` | Bắt buộc khi tạo/sửa |
| `description` | `string` | Mô tả tự do |
| `category` | `Category` | `Work` · `Personal` · `Study` · `Other` |
| `priority` | `Priority` | `Low` · `Medium` · `High` |
| `status` | `Status` | `Todo` · `In Progress` · `Done` |
| `deadline` | `string` | Ngày `YYYY-MM-DD` |
| `createdAt` | `string` | ISO timestamp, tự sinh khi tạo |

### FilterState (không persist)

| Field | Giá trị |
|-------|---------|
| `search` | Chuỗi tìm kiếm |
| `category` | `Category` hoặc `All` |
| `priority` | `Priority` hoặc `All` |
| `status` | `Status` hoặc `All` |

### TaskStats (tính toán, read-only)

`total`, `todo`, `inProgress`, `done`, `overdue`, `completionRate`, `byPriority: { Low, Medium, High }`

---

## 3. Chức năng theo module

### 3.1 Quản lý task (CRUD)

| Chức năng | Mô tả | Trigger UI |
|-----------|-------|------------|
| **Tạo task** | Thêm task mới với `id` và `createdAt` tự động | Nút "Add Task" → Modal + TaskForm |
| **Sửa task** | Merge partial update lên task hiện có | Nút Edit trên TaskCard |
| **Xóa task** | Loại task khỏi danh sách | Nút Delete trên TaskCard |
| **Di chuyển task** | Chỉ đổi `status` | Kéo-thả giữa các cột Kanban |

**Form (TaskForm):**

- Fields: title*, description, category, priority, deadline
- Validation: chỉ `title` bắt buộc (trim); lỗi hiển thị "Title is required."
- Chế độ Add: `status` mặc định `Todo`, deadline mặc định hôm nay
- Chế độ Edit: pre-fill từ task; giữ nguyên `status` hiện tại
- Cancel / đóng modal: không lưu thay đổi

### 3.2 Kanban Board

| Chức năng | Mô tả |
|-----------|-------|
| **3 cột cố định** | Todo · In Progress · Done |
| **Drag & drop** | `@dnd-kit/core`; kích hoạt sau kéo 8px (`PointerSensor`) |
| **Drop zone** | Cột-level — thả vào cột khác → đổi status |
| **Empty state** | Hiển thị "Chưa có task" khi cột rỗng |
| **Highlight** | Cột được hover khi kéo task qua (`ring-2 ring-blue-400`) |

**TaskCard hiển thị:**

- Title, badge priority (màu theo `PRIORITY_CLASSES`)
- Category, deadline (format `en-GB`, ví dụ "6 June 2026")
- Deadline quá hạn → màu đỏ (`OVERDUE_CLASS`) nếu chưa Done
- Nút Edit / Delete (không kích hoạt drag nhờ `stopPropagation`)

> **Lưu ý:** Không có reorder task trong cùng một cột.

### 3.3 Tìm kiếm & lọc

Áp dụng điều kiện **AND** trên toàn bộ tasks; kết quả → `filteredTasks` → Board.

| Chức năng | Logic |
|-----------|-------|
| **Search** | `trim().toLowerCase()` — match substring trong `title` hoặc `description` |
| **Filter Category** | Exact match hoặc `All` |
| **Filter Priority** | Exact match hoặc `All` |
| **Filter Status** | Exact match hoặc `All` |
| **Clear filters** | Reset về `{ search: '', category: 'All', priority: 'All', status: 'All' }` |

**Persist:** Filters **không** lưu — reload trang sẽ mất filter.

### 3.4 Dashboard (thống kê)

Tính từ **toàn bộ** `tasks` (không bị ảnh hưởng bởi filter đang active trên Board).

| Metric | Mô tả |
|--------|-------|
| Total | Tổng số task |
| Todo / In Progress / Done | Đếm theo status |
| Overdue | Task chưa Done có `deadline < hôm nay` |
| Completion rate | `round(done / total * 100)%`; total = 0 → 0% |
| Progress bar | Visualize completion rate |

> **Chưa hiển thị UI:** `stats.byPriority` (đã tính trong logic nhưng Dashboard chưa render).

### 3.5 Điều hướng & layout

| Chức năng | Mô tả |
|-----------|-------|
| **Tab Board** | Header tab → hiển thị SearchBar + FilterBar + Board |
| **Tab Dashboard** | Header tab → chỉ hiển thị Dashboard (không search/filter) |
| **Modal** | Overlay dialog cho form Add/Edit; đóng bằng nút ×, backdrop click, Cancel |
| **Responsive** | Board: 1 cột mobile → 3 cột md+; FilterBar: column mobile → row desktop |

---

## 4. Luồng người dùng

```
Mở app
  └─► Đọc tasks từ localStorage
        ├─► [Board] Xem / kéo-thả / edit / delete task
        │     ├─► Search + Filter → cập nhật danh sách hiển thị
        │     └─► Add Task → Modal → Submit → lưu localStorage
        └─► [Dashboard] Xem thống kê tổng (không filter)
```

### Data flow

```
useTasks()
  ├─► useLocalStorage('tinygoal-tasks')  ← persist
  ├─► filters (useState)                 ← ephemeral
  ├─► filteredTasks (useMemo)            → Board
  └─► tasks (full)                       → getStats() → Dashboard
```

---

## 5. Quy tắc nghiệp vụ

| Rule | Chi tiết |
|------|----------|
| Overdue | Task `Done` không bao giờ overdue |
| So sánh deadline | String `YYYY-MM-DD` vs ngày hôm nay (local timezone) |
| ID generation | `crypto.randomUUID()` |
| Update task | Shallow merge `{ ...task, ...updates }` |
| Stats scope | Luôn tính trên full task list |

---

## 6. Accessibility (đã có)

- Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`
- Dashboard: `aria-labelledby="dashboard-heading"`
- SearchBar: `type="search"`

---

## 7. Giới hạn / gap hiện tại

| # | Mô tả |
|---|-------|
| 1 | `TaskCardProps.onMove` khai báo nhưng không dùng — chỉ drag để đổi status |
| 2 | Dashboard không hiển thị breakdown theo priority (`byPriority`) |
| 3 | Stats không phản ánh filter đang active trên Board |
| 4 | Không reorder task trong cùng cột |
| 5 | Không export/import dữ liệu |
| 6 | Không có backend / sync đa thiết bị |
| 7 | `@dnd-kit/sortable` có trong `package.json` nhưng chưa dùng trong code |

---

## 8. Hook API (contract)

```ts
// useTasks()
tasks: Task[]
filteredTasks: Task[]
filters: FilterState
addTask(task: Omit<Task, 'id' | 'createdAt'>): void
updateTask(id: string, updates: Partial<Task>): void
deleteTask(id: string): void
moveTask(id: string, newStatus: Status): void
setSearch(value: string): void
setFilter(key: keyof FilterState, value: string): void
clearFilters(): void

// useLocalStorage<T>(key, initialValue)
[T, (value: T) => void]
```

---

## 9. Utils

| Function | Mục đích |
|----------|----------|
| `todayDateKey()` | Ngày hôm nay `YYYY-MM-DD` |
| `isOverdue(task)` | Kiểm tra quá hạn |
| `getStats(tasks)` | Tính `TaskStats` |
| `formatDeadline(dateString)` | Format hiển thị deadline |
| `generateId()` | Sinh UUID |
