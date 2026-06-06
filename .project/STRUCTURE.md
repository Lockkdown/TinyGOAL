# TinyGOAL — Project Structure

> Cấu trúc thư mục, tech stack, config và conventions của dự án.

---

## 1. Tech Stack

| Layer | Công nghệ | Phiên bản (package.json) |
|-------|-----------|--------------------------|
| Runtime | React | ^19.2.5 |
| Language | TypeScript | ~6.0.2 |
| Build | Vite | ^8.0.10 |
| Styling | Tailwind CSS | ^3.4.17 |
| Drag & Drop | @dnd-kit/core, @dnd-kit/utilities | ^6.3.1, ^3.2.2 |
| Storage | localStorage (browser) | — |
| Lint | ESLint + typescript-eslint | ^10.2.1 |

**Không dùng:** Next.js, shadcn/ui, styled-components, Redux, axios, backend.

> `@dnd-kit/sortable` đã cài nhưng chưa import trong source.

---

## 2. Cây thư mục

```
TinyGOAL/
├── .cursor/                     # Gitignored — Cursor rules (.mdc)
│   └── rules/
│       ├── tinygoal-project.mdc # Source of truth cho conventions
│       ├── typescript-react---best-practices.mdc
│       ├── typescript-react---additional-instructions.mdc
│       ├── memory-bank.mdc
│       ├── accessibility-guidelines.mdc
│       └── performance-optimization.mdc
│
├── .project/                    # Tài liệu dự án
│   ├── SPEC.md                  # Chức năng hiện tại
│   ├── STRUCTURE.md             # File này
│   └── PLAN.md                  # Kế hoạch (placeholder)
│
├── public/                      # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
├── src/                         # Application source
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Board.tsx        # Kanban container + DnD context
│   │   │   ├── Column.tsx       # Cột droppable theo status
│   │   │   └── TaskCard.tsx     # Thẻ task draggable
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx    # Panel thống kê
│   │   │   └── .gitkeep
│   │   ├── TaskForm/
│   │   │   └── TaskForm.tsx     # Form add/edit task
│   │   └── shared/
│   │       ├── Modal.tsx        # Dialog overlay
│   │       ├── SearchBar.tsx    # Ô tìm kiếm
│   │       └── FilterBar.tsx    # Bộ lọc 3 chiều
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts   # Generic localStorage ↔ React state
│   │   └── useTasks.ts          # CRUD, filters, filteredTasks
│   │
│   ├── types/
│   │   └── index.ts             # Domain types + component prop types
│   │
│   ├── utils/
│   │   └── helpers.ts           # Pure functions (stats, overdue, format)
│   │
│   ├── App.tsx                  # Root: view switch, modal, prop wiring
│   ├── main.tsx                 # React entry (createRoot + StrictMode)
│   └── index.css                # Chỉ @tailwind directives
│
├── index.html                   # HTML shell, mount #root
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── tsconfig.json                # Project references root
├── tsconfig.app.json            # App TS config
├── tsconfig.node.json           # Node/Vite TS config
├── AGENTS.md                    # Agent instructions (placeholder)
└── .gitignore
```

---

## 3. Vai trò từng layer

### 3.1 Entry & shell

| File | Vai trò |
|------|---------|
| `index.html` | Shell HTML, title "TinyGOAL", load `/src/main.tsx` |
| `src/main.tsx` | Bootstrap React 18 `createRoot`, `StrictMode` |
| `src/index.css` | Tailwind base/components/utilities only |
| `src/App.tsx` | Orchestrator: `useTasks`, view tabs, modal state, compose components |

### 3.2 Components (`src/components/`)

| Nhóm | Trách nhiệm |
|------|-------------|
| **Board/** | Kanban UI, drag-drop giữa cột, render TaskCard |
| **Dashboard/** | Hiển thị metrics read-only từ `TaskStats` |
| **TaskForm/** | Form controlled add/edit, validation title |
| **shared/** | Modal, SearchBar, FilterBar — tái sử dụng |

**Quy ước file:** PascalCase (`TaskCard.tsx`), export named + default, props interface tại `types/index.ts`.

### 3.3 Hooks (`src/hooks/`)

| Hook | Trách nhiệm |
|------|-------------|
| `useLocalStorage` | Đọc/ghi JSON vào `localStorage`, sync React state |
| `useTasks` | Single source of truth cho tasks; filter logic; CRUD API |

### 3.4 Types (`src/types/`)

Tập trung **tất cả** types: domain (`Task`, `FilterState`, `TaskStats`) và component props (`BoardProps`, `TaskCardProps`, …).

### 3.5 Utils (`src/utils/`)

Chỉ **pure functions** — không side effects, không React hooks.

---

## 4. Config files

| File | Vai trò |
|------|---------|
| `vite.config.ts` | Vite + `@vitejs/plugin-react` |
| `tailwind.config.js` | Scan `./index.html`, `./src/**/*.{ts,tsx}` |
| `postcss.config.js` | Tailwind + autoprefixer pipeline |
| `eslint.config.js` | ESLint flat config, React hooks + refresh plugins |
| `tsconfig.json` | References `tsconfig.app.json` + `tsconfig.node.json` |
| `tsconfig.app.json` | Strict TS cho app source |
| `tsconfig.node.json` | TS cho Vite config files |
| `.gitignore` | node_modules, dist, editor files |

---

## 5. Scripts & dependencies

### npm scripts

| Script | Lệnh | Mục đích |
|--------|------|----------|
| `dev` | `vite` | Dev server |
| `build` | `tsc -b && vite build` | Typecheck + production build |
| `lint` | `eslint .` | Lint toàn project |
| `preview` | `vite preview` | Preview build |

### Production dependencies

| Package | Dùng ở |
|---------|--------|
| `react`, `react-dom` | Toàn app |
| `@dnd-kit/core` | Board, Column, TaskCard |
| `@dnd-kit/utilities` | TaskCard (CSS transform) |
| `@dnd-kit/sortable` | *(chưa dùng)* |

---

## 6. Component tree (runtime)

```
App
├── Header (tabs: Board | Dashboard, nút Add Task)
├── [view = board]
│   ├── SearchBar
│   ├── FilterBar
│   └── Board
│       ├── Column (Todo)
│       │   └── TaskCard × N
│       ├── Column (In Progress)
│       │   └── TaskCard × N
│       └── Column (Done)
│           └── TaskCard × N
├── [view = dashboard]
│   └── Dashboard
└── Modal
    └── TaskForm
```

---

## 7. Data & state ownership

| State | Owner | Persist |
|-------|-------|---------|
| `tasks: Task[]` | `useTasks` → `useLocalStorage` | ✅ `tinygoal-tasks` |
| `filters: FilterState` | `useTasks` (useState) | ❌ |
| `isFormOpen`, `editingTask` | `App.tsx` (useState) | ❌ |
| `activeView` | `App.tsx` (useState) | ❌ |
| Form fields | `TaskForm` (useState) | ❌ |

---

## 8. Styling conventions

- **Tailwind utility classes** trực tiếp trong JSX — không file `.css` riêng
- **Color maps** (object `Record`), không hardcode inline:
  - `PRIORITY_CLASSES`, `STATUS_CLASSES`, `OVERDUE_CLASS`
- **Inline `style={{}}`** chỉ cho giá trị tính toán: drag transform, progress bar width
- **Palette:** slate (neutral), blue (primary), green/yellow/red (priority/status/overdue)

---

## 9. Naming conventions

| Loại | Quy ước | Ví dụ |
|------|---------|-------|
| Functions | camelCase | `addTask`, `isOverdue` |
| Types | PascalCase | `Task`, `FilterState` |
| Components | PascalCase | `TaskCard` |
| Component files | PascalCase.tsx | `TaskCard.tsx` |
| Hook files | camelCase + `use` | `useTasks.ts` |
| localStorage keys | `tinygoal-` prefix | `tinygoal-tasks` |

---

## 10. Import graph (tóm tắt)

```
main.tsx
  └── App.tsx
        ├── useTasks (hooks)
        ├── getStats (utils)
        ├── Board, Dashboard, TaskForm, Modal, SearchBar, FilterBar (components)
        └── types (implicit qua props)

useTasks
  ├── useLocalStorage
  ├── types
  └── helpers (generateId)

Board / Column / TaskCard
  ├── @dnd-kit/*
  ├── types
  └── helpers (TaskCard: formatDeadline, isOverdue)

TaskForm
  ├── types
  └── helpers (todayDateKey)
```

---

## 11. Public assets

| File | Mục đích |
|------|----------|
| `public/favicon.svg` | Favicon (link trong `index.html`) |
| `public/icons.svg` | SVG sprite (template Vite, chưa dùng trong app) |

---

## 12. Tài liệu liên quan

| File | Nội dung |
|------|----------|
| `.project/SPEC.md` | Chức năng & behavior hiện tại (đã điền) |
| `.project/STRUCTURE.md` | Cấu trúc dự án (file này) |
| `.project/PLAN.md` | Kế hoạch phát triển (chưa có nội dung) |
| `AGENTS.md` | Hướng dẫn cho AI agents (chưa có nội dung) |
| `.cursor/rules/tinygoal-project.mdc` | Conventions chi tiết (gitignored, ưu tiên cao nhất) |
