# 🏗️ PROJECT STRUCTURE — TASK MANAGER "LOCKDOWN"

> Mục đích: Quy định tổ chức thư mục và file — AI phải follow đúng, không tự ý tạo file ngoài cấu trúc này
> Cập nhật: 10/05/2026 — Tailwind thay CSS thuần, bỏ thư mục styles/

---

## 📁 THƯ MỤC GỐC

```
TinyGOAL/
├── docs/                          # Tài liệu dự án (không phải code)
│   ├── spec-overall.md
│   ├── spec-structure.md          # File này
│   ├── spec-context.md
│   ├── task-overall.md
│   └── current-task.md
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── TaskForm/
│   │   │   └── TaskForm.tsx
│   │   └── shared/
│   │       ├── SearchBar.tsx
│   │       ├── FilterBar.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── index.css              # Chỉ chứa Tailwind directives (@tailwind base/components/utilities)
│   ├── App.tsx
│   └── main.tsx
├── .cursor/
│   └── rules/
│       ├── react-ts.mdc       # React + TypeScript rules
│       └── caveman.mdc        # Token reduction rules
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 📌 QUY TẮC TỔ CHỨC

### Styling — Tailwind
- Dùng Tailwind utility classes trực tiếp trong JSX — không tạo file `.css` riêng cho component
- `index.css` chỉ chứa 3 dòng Tailwind directives — không viết CSS thêm vào đây
- Với style động (ví dụ: màu theo priority), dùng object map thay vì inline style:
```ts
const priorityColor = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
}
```
- Không dùng `style={{}}` trừ trường hợp giá trị tính toán động (ví dụ: progress bar width %)

### Components
- Mỗi component có 1 file `.tsx` riêng
- Tên file = Tên component (PascalCase): `TaskCard.tsx`
- Không viết logic phức tạp trong component — đẩy vào hooks
- Component chỉ nhận props và render UI

### Hooks
- `useTasks.ts` — state chính + toàn bộ CRUD logic
- `useLocalStorage.ts` — generic hook, tái sử dụng được

### Types
- Tất cả types trong `src/types/index.ts`
- Không định nghĩa type inline trong component

### Utils
- `helpers.ts` — pure functions: tính toán, format, kiểm tra overdue
- Không import React vào utils

---

## 🔗 IMPORT PATH RULES

```ts
// ✅ Đúng
import { Task, Status } from '../types'
import { useTasks } from '../hooks/useTasks'
import { isOverdue, getStats } from '../utils/helpers'

// ❌ Sai — không import type từ component khác
import { Task } from '../components/Board/TaskCard'
```

---

## ⚠️ LƯU Ý CHO AI (Cursor)

- Không tạo file CSS riêng cho component — dùng Tailwind class
- Không tự tạo file ngoài cấu trúc trên
- Không thêm thư viện ngoài danh sách trong spec-overall.md
- Không dùng `any` type
- Không tạo state trong component nếu đã có trong `useTasks`
- Mọi thay đổi cấu trúc phải hỏi Lockdown trước
