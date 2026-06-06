# TinyGOAL — PLAN (Update Batch #1)

> Handoff for Cursor (Composer). Read alongside `TODO.md` (scope) + `SPEC.md` + `STRUCTURE.md`.
> **Mandatory order:** Phase 1 → 2 → 3 → 4. DO NOT skip phases.
> **Checkpoint:** At the end of each phase, STOP for human review before moving on. Do not merge phases on your own.

---
## PHASE 1 — Cleanup (Group A2: remove Search + Filter)

> Done first because it shrinks the code surface, making the Phase 2 refactor lighter.

### Step 1.1 — Remove UI
- [ ] Delete `src/components/shared/SearchBar.tsx`
- [ ] Delete `src/components/shared/FilterBar.tsx`

### Step 1.2 — Clean `useTasks` + rename Board prop
- [ ] Remove `filteredTasks` (useMemo) from the hook
- [ ] Remove `filters`, `setSearch`, `setFilter`, `clearFilters` from the hook's return
- [ ] **Rename prop** (not just change data source): `BoardProps.filteredTasks` → `tasks` in `src/types/index.ts`
- [ ] Update `Board.tsx`: destructure `tasks`, replace every `filteredTasks` reference
- [ ] Update `App.tsx`: `<Board tasks={tasks} ... />` (not `filteredTasks={...}`)

### Step 1.3 — Clean types
- [ ] Remove `FilterState`, `SearchBarProps`, `FilterBarProps` from `src/types/index.ts`
- [ ] Remove any leftover `FilterState`, `SearchBar`, `FilterBar` imports

### Step 1.4 — Add `toggleDone` (prep for Phase 3)
- [ ] Add to `useTasks`:
```ts
toggleDone(id: string): void
// status === 'Done' ? back to 'Todo' : set to 'Done'
```

**✅ Acceptance Phase 1:**
- App runs, Board shows tasks normally, NO Search/Filter bar.
- `npm run build` + `npm run lint` pass, no unused-import warnings.
- No `filter`/`search`/`filteredTasks` references left in `useTasks`, `types`, `App.tsx`, `Board.tsx`.

> ⛔ **CHECKPOINT 1** — Stop. Notify reviewer before Phase 2.

---

## PHASE 2 — Refactor `App.tsx` (Group A1)

> Separate shell from logic. NO new features in this phase.

### Step 2.1 — Create new layers
- [ ] Create `src/views/` and `src/components/layout/`

### Step 2.2 — Extract Header (preserve tab ARIA)
- [ ] Create `src/components/layout/Header.tsx`
- [ ] Holds: tabs (keep names Board/Dashboard this batch), "Add Task" button
- [ ] Receives props: `activeView`, `onChangeView`, `onAddTask`
- [ ] **Move tab ARIA intact** from `App.tsx` — do NOT drop accessibility:
  - Tab list: `role="tablist"`, `aria-label="Switch view"`
  - Each tab button: `role="tab"`, `aria-selected`, `id` (`tab-board` / `tab-dashboard`), `aria-controls` (`board-panel` / `dashboard-panel`)

### Step 2.3 — Extract views (tabpanel + padding + stats)
- [ ] `src/views/BoardView.tsx`:
  - Receives `tasks` + `moveTask` / `deleteTask` / `onEditTask` via props (DO NOT call `useTasks`)
  - **Replaces** the old `board-panel` wrapper (Search/Filter div is gone after Phase 1)
  - Outer element: `id="board-panel"`, `role="tabpanel"`, `aria-labelledby="tab-board"`
  - Wraps `<Board>` inside the tabpanel (fixes pre-refactor bug where Board sat outside tabpanel)
  - Layout classes: `mx-auto w-full max-w-6xl px-4 pt-6 pb-8` — consolidate padding here; remove duplicate `px-4` from `Board.tsx` if double-padding occurs
- [ ] `src/views/DashboardView.tsx`:
  - Receives `tasks` via props (DO NOT call `useTasks`)
  - Outer element: `id="dashboard-panel"`, `role="tabpanel"`, `aria-labelledby="tab-dashboard"`
  - **Move stats computation here** — not just a bare `getStats()` call:
```ts
const stats = useMemo(() => getStats(tasks), [tasks])
return <Dashboard stats={stats} />
```

### Step 2.4 — Slim down App.tsx (shell owns modal handlers)
- [ ] `App.tsx` ONLY: calls `useTasks` once, holds `activeView` / `isFormOpen` / `editingTask`
- [ ] Renders `<Header>` + active view + `<Modal><TaskForm/></Modal>`
- [ ] **Modal handlers stay in App** (shell owns modal state — views do NOT duplicate these):
  - `handleAddTask`, `handleEditTask`, `handleCloseForm`, `handleFormSubmit` — keep `useCallback` wrappers here
  - Pass down: `onAddTask={handleAddTask}` → Header; `onEditTask={handleEditTask}` → BoardView
- [ ] No `getStats`, no `useMemo` stats, no other computation logic in App

**✅ Acceptance Phase 2:**
- Behavior identical to pre-refactor (board + dashboard + add/edit/delete/drag all work).
- `App.tsx` < ~50 lines, no business logic, no `getStats` / stats `useMemo`.
- `useTasks` still called exactly once in App, passed down via props.
- Tab/tabpanel ARIA intact: Header has tablist + tabs; BoardView/DashboardView each own their tabpanel.
- BoardView tabpanel wraps Board (not a separate empty wrapper).
- Build + lint pass.

> ⛔ **CHECKPOINT 2** — Stop. Review that App.tsx is "clean" before Phase 3.

---

## PHASE 3 — List View + view switching (Group C)

### Step 3.1 — Layout state
- [ ] Add state `boardLayout: 'board' | 'list'` (default `'board'`)
- [ ] Persist to localStorage key `tinygoal-view` (use `useLocalStorage`)
- [ ] **Separate** from `activeView` (board/dashboard). When on Dashboard, the board/list switcher is hidden.

### Step 3.2 — View switcher (icons)
- [ ] Add a 2-icon button cluster to Header: Board (grid) | List (≡) — per image 1
- [ ] Active button highlighted; clicking toggles `boardLayout`

### Step 3.3 — List View component
- [ ] Create `src/components/List/ListView.tsx` (+ `TaskListItem.tsx` if needed)
- [ ] Group tasks by status: Todo / In Progress / Done (heading + count per group, like image 5)
- [ ] Each row: `[checkbox]  title   ·  deadline / compact category badge`
- [ ] Vertical compact list — not large cards
- [ ] Consume `tasks` from props (DO NOT call useTasks itself)

### Step 3.4 — Checkbox + toggleDone
- [ ] Square checkbox at the start of each row
- [ ] Tick → call `toggleDone(id)` → task goes to `Done`
- [ ] `Done` tasks show a ticked checkbox

### Step 3.5 — Wire into view switching
- [ ] When `activeView === 'board'`: render `BoardView` if `boardLayout==='board'`, render `ListView` if `'list'`

**✅ Acceptance Phase 3:**
- Switching Board ↔ List is smooth, same task set, reload preserves the chosen layout.
- Ticking a checkbox in List → task goes to Done, reflected even when switching back to Board.
- Build + lint pass.

> ⛔ **CHECKPOINT 3** — Stop. Review before adding animation.

---

## PHASE 4 — Animation (Group B + C3)

> Final polish layer. CSS/Tailwind only, no libraries.

### Step 4.1 — Strikethrough on tick (C3)
- [ ] When a task is `Done` in List View: title gets an **animated** `line-through` (line runs left→right) + slight opacity drop
- [ ] Hint: pseudo-element `::after` width 0→100% transition, or background-size animation
- [ ] Untick → reverse smoothly

### Step 4.2 — "In Progress" animation (B1)
- [ ] TaskCard (Board) when `status === 'In Progress'`: show "` . . . `" 3-dot pulse/run
- [ ] Use `@keyframes` + Tailwind `animate-[...]`

### Step 4.3 — "Done" animation — option (a) (B2)
- [ ] When a task enters Done (both Board and List): a **green check mark bursts in** (scale 0→1 + fade-in, ~200-300ms)
- [ ] Runs once on transition, no loop

**✅ Acceptance Phase 4:**
- All 3 animations fire in the right place, smooth, no layout shift.
- Fine on low-end machines (lightweight, not overused).
- Build + lint pass.

> ⛔ **CHECKPOINT 4** — Stop. Review the whole of batch #1.

---

## After Batch #1

Update `SPEC.md` + `STRUCTURE.md` to reflect: filters removed, added `views/` + `layout/` + List View + `toggleDone` + `boardLayout`. Then open Group D in batch #2.

---

## File change map (summary)

| File | Action |
|------|--------|
| `shared/SearchBar.tsx`, `shared/FilterBar.tsx` | ❌ Delete |
| `types/index.ts` | Drop `FilterState`; rename `BoardProps.filteredTasks` → `tasks`; add prop types for List/Header |
| `components/Board/Board.tsx` | Rename prop `filteredTasks` → `tasks`; adjust padding if BoardView owns outer spacing |
| `hooks/useTasks.ts` | Drop filter API; add `toggleDone` |
| `App.tsx` | Refactor thinner; keep modal handlers + modal state |
| `views/BoardView.tsx`, `views/DashboardView.tsx` | 🆕 Create (tabpanel + padding; DashboardView owns `useMemo` stats) |
| `components/layout/Header.tsx` | 🆕 Create (tab ARIA from App) |
| `components/List/ListView.tsx` (+item) | 🆕 Create |
| `index.css` | Add `@keyframes` for animation |
| `hooks/useLocalStorage.ts` | Reuse for `tinygoal-view` |