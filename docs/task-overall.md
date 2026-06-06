# 📋 TASK OVERALL — TASK MANAGER "LOCKDOWN"

> Purpose: Full task breakdown by feature — detailed enough for Cursor to implement one task at a time
> Rule: Each task must be small enough to complete in one session (~30-60 min)

---

## 🏁 PHASE 1 — MVP (Deadline: 16/05/2026)

### SETUP

- [ ] **SETUP-01** — Initialize Vite + React + TypeScript project
  - Run: `npm create vite@latest tinygoal -- --template react-ts`
  - Install Tailwind: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
  - Configure `tailwind.config.js` content: `["./index.html", "./src/**/*.{ts,tsx}"]`
  - Delete: `App.css`
  - Reset `src/index.css` to Tailwind directives only (@tailwind base/components/utilities)
  - Clear `App.tsx` to empty shell: `export default function App() { return <div /> }`
  - Create folder structure per `docs/spec-structure.md`

- [ ] **SETUP-02** — Install dependencies
  - `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
  - Verify `package.json` has all entries

- [ ] **SETUP-03** — Create `src/types/index.ts`
  - Copy exact types from `docs/spec-context.md`
  - Export all types

---

### CORE LOGIC

- [x] **CORE-01** — Create `src/utils/helpers.ts`
  - Implement: `isOverdue`, `getStats`, `formatDeadline`, `generateId`
  - Do NOT import React
  - Do NOT include `getPriorityClass` or `getStatusClass` — use Tailwind object maps in components instead (see tinygoal-project.mdc)
  - Manually test each function with `console.log`

- [x] **CORE-02** — Create `src/hooks/useLocalStorage.ts`
  - Generic hook `useLocalStorage<T>`
  - Handle JSON parse failure with try/catch

- [x] **CORE-03** — Create `src/hooks/useTasks.ts`
  - Use `useLocalStorage` to persist tasks
  - Implement: `addTask`, `updateTask`, `deleteTask`, `moveTask`
  - Implement: `filteredTasks` (derived state from tasks + filters)
  - Implement: `setSearch`, `setFilter`, `clearFilters`
  - Default `filters`: `{ search: '', category: 'All', priority: 'All', status: 'All' }`

---

### UI — BOARD

- [x] **BOARD-01** — Create `src/components/Board/Board.tsx`
  - 3-column horizontal layout using Tailwind flex/grid
  - Get data from `useTasks()`
  - Split `filteredTasks` by `status` for each Column
  - Style with Tailwind

- [x] **BOARD-02** — Create `src/components/Board/Column.tsx`
  - Header with `status` label and task count badge
  - Render list of `TaskCard`
  - Empty state when no tasks
  - Style with Tailwind

- [x] **BOARD-03** — Create `src/components/Board/TaskCard.tsx`
  - Display: title, category, priority badge, deadline
  - Overdue highlight: use `OVERDUE_CLASS` from tinygoal-project.mdc (Tailwind class)
  - Priority badge: use `PRIORITY_CLASSES` object map
  - Edit + Delete buttons
  - Style with Tailwind

---

### UI — FORM & MODAL

- [x] **FORM-01** — Create `src/components/shared/Modal.tsx`
  - Overlay + modal container
  - Close (X) button
  - Close on overlay click
  - Style with Tailwind

- [x] **FORM-02** — Create `src/components/TaskForm/TaskForm.tsx`
  - Fields: title (required), description, category (select), priority (select), deadline (date)
  - Validate: block submit when title is empty
  - Detect edit vs add mode from `initialData`
  - Style with Tailwind

- [x] **FORM-03** — Connect Form to App.tsx
  - State: `isFormOpen`, `editingTask`
  - "Add Task" button opens empty modal form
  - Click Edit on card → open modal form with data
  - Submit → call `addTask` or `updateTask`
  - Cancel/Close → reset state

---

### UI — FILTER & SEARCH

- [ ] **FILTER-01** — Create `src/components/shared/SearchBar.tsx`
  - Realtime input → call `setSearch`
  - No debounce needed for MVP
  - Style with Tailwind

- [ ] **FILTER-02** — Create `src/components/shared/FilterBar.tsx`
  - 3 selects: Category, Priority, Status
  - "Clear" button → `clearFilters`
  - Style with Tailwind

- [ ] **FILTER-03** — Integrate SearchBar + FilterBar into Board/App
  - Place above the board
  - Verify filters work correctly with `filteredTasks`

---

### DRAG & DROP

- [ ] **DND-01** — Wrap Board with `DndContext` from `@dnd-kit/core`
  - Setup `onDragEnd` handler
  - Call `moveTask(id, newStatus)` when card dropped into different column

- [ ] **DND-02** — Make Column droppable
  - Use `useDroppable` — droppable `id` = status string
  - Highlight column with Tailwind class when drag is over

- [ ] **DND-03** — Make TaskCard draggable
  - Use `useDraggable` — draggable `id` = task id
  - Visual feedback when dragging: reduce opacity via Tailwind

---

### DASHBOARD

- [ ] **DASH-01** — Create `src/components/Dashboard/Dashboard.tsx`
  - Receive `stats: TaskStats` as props
  - Display: total tasks, todo/in-progress/done counts, overdue count, completion rate
  - Progress bar using Tailwind (e.g. `w-[{completionRate}%]` with inline style for dynamic width)
  - Style with Tailwind

- [ ] **DASH-02** — Integrate Dashboard into App
  - Separate tab or section
  - Calculate `stats` from `getStats(tasks)` in App or Board

---

### POLISH

- [ ] **POLISH-01** — Verify LocalStorage
  - Test: add task → refresh → still there
  - Test: delete task → refresh → gone
  - Test: edit task → refresh → correct data

- [ ] **POLISH-02** — Empty states
  - No tasks on board → "No tasks yet. Add your first task!"
  - Filter returns nothing → "No tasks match your filters."

- [ ] **POLISH-03** — Delete confirmation
  - `window.confirm('Delete this task?')` or custom confirm modal
  - Do not delete if user cancels

- [ ] **POLISH-04** — Basic responsive layout
  - Mobile: 3 columns → stack vertically
  - Use Tailwind responsive prefix: `flex-col md:flex-row`

- [ ] **POLISH-05** — README.md
  - Project description
  - Tech stack
  - How to run: `npm install`, `npm run dev`
  - Screenshot (add after completion)

- [ ] **POLISH-06** — Deploy
  - Vercel: `npx vercel` or connect GitHub repo
  - Or GitHub Pages with `base` config in `vite.config.ts`

---

## 🚀 PHASE 2 — After internship stamp (Not started)

- [ ] Calendar view
- [ ] Advanced statistics (charts)
- [ ] Backend sync (Supabase or Firebase)
- [ ] Authentication
- [ ] Board sharing

---

## 📊 TRACKING

| Task ID | Status | Date | Notes |
|---|---|---|---|
| SETUP-01 | ⬜ Not started | | |
| SETUP-02 | ⬜ Not started | | |
| SETUP-03 | ⬜ Not started | | |
| CORE-01 | Done | 10/05/2026 | helpers.ts |
| CORE-02 | Done | 10/05/2026 | useLocalStorage.ts |
| CORE-03 | Done | 10/05/2026 | useTasks.ts |
| BOARD-01 | Done | 10/05/2026 | Board.tsx + App |
| BOARD-02 | Done | 10/05/2026 | Column.tsx |
| BOARD-03 | Done | 10/05/2026 | TaskCard.tsx |
| FORM-01 | Done | 10/05/2026 | Modal.tsx |
| FORM-02 | Done | 10/05/2026 | TaskForm.tsx |
| FORM-03 | Done | 10/05/2026 | App + BoardProps |
| FILTER-01 | ⬜ Not started | | |
| FILTER-02 | ⬜ Not started | | |
| FILTER-03 | ⬜ Not started | | |
| DND-01 | ⬜ Not started | | |
| DND-02 | ⬜ Not started | | |
| DND-03 | ⬜ Not started | | |
| DASH-01 | ⬜ Not started | | |
| DASH-02 | ⬜ Not started | | |
| POLISH-01 | ⬜ Not started | | |
| POLISH-02 | ⬜ Not started | | |
| POLISH-03 | ⬜ Not started | | |
| POLISH-04 | ⬜ Not started | | |
| POLISH-05 | ⬜ Not started | | |
| POLISH-06 | ⬜ Not started | | |
