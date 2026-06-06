# TinyGOAL — TODO (Update Batch #1)

> This file **locks the scope** of what needs to be fixed/added. Once approved → move to `PLAN.md` for Cursor to execute.
> Principle: TODO describes **WHAT + WHY**. PLAN describes **HOW + ORDER**.

---

## Status

| Group | Items | Priority |
|-------|-------|----------|
| A — Refactor & cleanup | 2 | 🔴 Do first (foundation) |
| B — Animation | 2 | 🟡 After A is done |
| C — List View + view switching | 3 | 🟡 Main feature this batch |
| D — Later (not this batch) | 3 | ⚪ Backlog |

**Mandatory execution order:** A → C → B → (D later).
Reason: refactor (A) must finish before spawning new views (C), otherwise we refactor on top of garbage code. Animation (B) comes last because it's a polish layer, not logic.

---

## GROUP A — Refactor & Cleanup

### A1. Extract logic out of `App.tsx`

**Problem:** `App.tsx` currently holds both UI state (`isFormOpen`, `editingTask`, `activeView`) AND composes every component + wires props. It's both the "shell" and the "logic" → violates single responsibility.

**Chosen approach (locked):** Split into self-contained child components, add a `views/` layer.

**Proposed structure (extending current STRUCTURE.md):**

```
src/
├── views/                       # NEW — each view is a self-contained component
│   ├── BoardView.tsx            # Wraps Board — pulls data from useTasks via props
│   ├── ListView.tsx             # NEW (see C2)
│   └── DashboardView.tsx        # Wraps Dashboard
│
├── components/
│   ├── layout/                  # NEW
│   │   └── Header.tsx           # Tabs + view switcher + Add Task button
│   ├── Board/ ...               # unchanged
│   ├── List/                    # NEW (see C2)
│   ├── Dashboard/ ...           # unchanged
│   ├── TaskForm/ ...            # unchanged
│   └── shared/
│       ├── Modal.tsx            # keep
│       ├── SearchBar.tsx        # ❌ DELETE (see A2)
│       └── FilterBar.tsx        # ❌ DELETE (see A2)
│
└── App.tsx                      # ONLY: layout shell + view switching + modal mount
```

**`App.tsx` after refactor may ONLY contain:**
- Minimal orchestration state: `activeView`, `isFormOpen`, `editingTask`
- Render: `<Header />`, the active view, `<Modal>` wrapping `<TaskForm>`
- NO computation logic (e.g. the current direct `getStats` call) → push it into `DashboardView`

> ✅ **LOCKED:** Call `useTasks` **exactly once in `App.tsx`** and pass down to views via props (prop drilling). NO Context this batch — keep it simple, true to learning fundamentals. Views must NOT call `useTasks` themselves (avoids out-of-sync state copies).

---

### A2. Remove Search + all Filters (locked: remove everything)

**Problem:** Search + 3 filters (Category/Priority/Status) are redundant for current needs.

**Cascade deletion — do NOT delete halfway:**

| Component | Action |
|-----------|--------|
| `components/shared/SearchBar.tsx` | ❌ Delete file |
| `components/shared/FilterBar.tsx` | ❌ Delete file |
| `FilterState` (type) | ❌ Remove from `types/index.ts` |
| `filters`, `setSearch`, `setFilter`, `clearFilters` | ❌ Remove from `useTasks` API |
| `filteredTasks` (useMemo) | ❌ Remove — Board/List consume `tasks` directly |
| Related imports in `App.tsx` | ❌ Clean up |

**After deletion, the `useTasks` API shrinks to:**
```ts
tasks: Task[]
addTask(task: Omit<Task, 'id' | 'createdAt'>): void
updateTask(id: string, updates: Partial<Task>): void
deleteTask(id: string): void
moveTask(id: string, newStatus: Status): void
toggleDone(id: string): void   // NEW — for List View checkbox (see C3)
```

> ✅ Benefit: less dead code, leaner hook. This is good cleanup, not a loss.

---

## GROUP C — List View + view switching

### C1. View switcher icon (per image 1)

- Add a "View" button cluster to `Header` (next to tabs): **Board** | **List**.
- Image 1 shows two icons: list icon (≡) and board/grid icon.
- State `boardLayout: 'board' | 'list'` — **separate** from `activeView: 'board' | 'dashboard'`.
  - Meaning: Dashboard remains its own view. Board/List are two *ways to display tasks*.
- Persist this choice to localStorage (key `tinygoal-view`) so reload keeps it.

> ✅ **LOCKED:** Board & List are two display modes of the **same task set**. Dashboard stays a separate view.

### C2. List View component (per image 5)

- Location: `src/components/List/` + `src/views/ListView.tsx`
- Display tasks **grouped by status**: Todo / In Progress / Done (like Overdue/No Date in image 5, but grouped by status).
- Each task row shows: square checkbox + title + (deadline / compact category badge).
- Vertical list layout, compact — NOT large cards like Board.

### C3. Checkbox tick + strikethrough animation

- Each task has a square checkbox at the start of the row.
- Tick → task moves to `status = 'Done'` (uses `toggleDone` from A2).
- **Animation:** on tick, the title gets a **left-to-right running strikethrough** (animated line-through, not a hard toggle) + fades (opacity).
- Untick → reverse (remove strikethrough).

> ✅ **LOCKED:** Tick = move straight to `status = 'Done'`. No separate "completed" field — use the existing data model.

---

## GROUP B — Animation (do last)

### B1. Animation when a task enters "In Progress"
- A "` . . . `" effect (3 dots running / pulsing) signaling work in progress.
- Attached to TaskCard when `status === 'In Progress'`.

### B2. Animation when a task enters "Done"
- An effect highlighting completion.

> ✅ **LOCKED — option (a):** A **green check mark bursting in** (scale + fade-in) when a task enters Done. No background flash / confetti.

---

## GROUP D — Later (NOT this batch)

> Logged so we don't forget, but **not part of PLAN batch #1**. Prevents scope creep.

- **D1.** Linear-style labels (image 6): colored badge + priority icon, task code (LOC-28...).
- **D2.** Left sidebar: move Board/Dashboard into a sidebar. Rename **Board → Task** (with icon), **Dashboard → Statistic**.
- **D3.** Statistic update (details TBD).

---

## Lock status

✅ All decisions locked. Batch #1 scope frozen (A + B + C). D goes to backlog.
→ Proceed to `PLAN.md` to break execution steps for Cursor.