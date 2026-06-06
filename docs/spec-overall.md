# 📋 PROJECT SPEC — TASK MANAGER "LOCKDOWN"

> Version: 1.1 — Cập nhật 10/05/2026  
> Stack: React + TypeScript + Tailwind CSS + Vite  
> Thời gian: ~3 tuần (deadline MVP: 16/05/2026)  
> Mục tiêu: Dấu mộc thực tập + bỏ vào CV

---

## 🎯 MỤC TIÊU PROJECT

- Ứng dụng quản lý task cá nhân có Kanban board
- Dùng được thật sự trong cuộc sống hàng ngày
- Code hiểu từng dòng — không vibe code

---

## 🧰 TECH STACK

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Vite | 5+ | Build tool |
| Tailwind CSS | 3+ | Styling |
| @dnd-kit/core | latest | Drag & drop |
| @dnd-kit/sortable | latest | Sortable list helper |

---

## 🗂️ DATA TYPES

```ts
type Category = 'Work' | 'Personal' | 'Study' | 'Other'

type Priority = 'Low' | 'Medium' | 'High'

type Status = 'Todo' | 'In Progress' | 'Done'

type Task = {
  id: string           // dùng crypto.randomUUID()
  title: string
  description: string
  category: Category
  priority: Priority
  status: Status
  deadline: string     // ISO date string, ví dụ: "2026-05-01"
  createdAt: string    // ISO date string
}
```

---

## 📦 FEATURES — PHASE 1 (MVP deadline 16/05)

### 1. Kanban Board
- [ ] 3 cột: **Todo** / **In Progress** / **Done**
- [ ] Mỗi cột hiển thị số lượng task (badge)
- [ ] Card task hiển thị: title, category, priority, deadline
- [ ] Kéo thả card giữa các cột để đổi status (dùng `@dnd-kit/core`)
- [ ] Cột highlight khi đang kéo card vào

### 2. CRUD Task
- [ ] **Thêm task**: form có title, description, category, priority, deadline
- [ ] **Sửa task**: click vào card → mở modal edit
- [ ] **Xóa task**: nút delete trong card → confirm trước khi xóa
- [ ] **Xem chi tiết**: click card → hiện đủ thông tin

### 3. Filter & Search
- [ ] Search theo title (real-time)
- [ ] Filter theo Category
- [ ] Filter theo Priority
- [ ] Filter theo Status
- [ ] Clear filter về default

### 4. Dashboard thống kê
- [ ] Tổng số task
- [ ] Số task theo từng status (Todo / In Progress / Done)
- [ ] Số task theo Priority (Low / Medium / High)
- [ ] Số task quá hạn (deadline < hôm nay + status != Done)
- [ ] Completion rate (% task Done / tổng)

### 5. LocalStorage
- [ ] Tự động lưu mỗi khi state thay đổi
- [ ] Load lại data khi refresh trang
- [ ] Không mất data khi đóng tab

### 6. UX nhỏ nhưng quan trọng
- [ ] Task quá hạn → deadline text đỏ
- [ ] Không cho submit form khi title trống
- [ ] Empty state khi không có task nào

---

## 🏗️ CẤU TRÚC THƯ MỤC

```
src/
├── components/
│   ├── Board/
│   │   ├── Board.tsx          # Kanban board chính
│   │   ├── Column.tsx         # 1 cột (Todo/In Progress/Done)
│   │   └── TaskCard.tsx       # 1 card task
│   ├── Dashboard/
│   │   └── Dashboard.tsx      # Trang thống kê
│   ├── TaskForm/
│   │   └── TaskForm.tsx       # Form thêm/sửa task
│   └── shared/
│       ├── SearchBar.tsx
│       ├── FilterBar.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useTasks.ts            # Logic CRUD + state chính
│   └── useLocalStorage.ts     # Hook persist data
├── types/
│   └── index.ts               # Tất cả types
├── utils/
│   └── helpers.ts             # Hàm tính toán (isOverdue, getStats...)
└── App.tsx
```

> Không có thư mục `styles/` — dùng Tailwind utility classes trực tiếp trong JSX

---

## 🗓️ KẾ HOẠCH THỰC TẾ (1 tiếng/ngày)

### Ngày 9-10/5 — Setup + Core
- [ ] Setup Vite + React + TypeScript + Tailwind
- [ ] Tạo types, `useLocalStorage`, `useTasks`, `helpers.ts`

### Ngày 11-12/5 — Board UI
- [ ] Board + Column + TaskCard (render tĩnh)
- [ ] Tailwind styling cơ bản

### Ngày 13-14/5 — CRUD
- [ ] Modal + TaskForm
- [ ] Thêm / Sửa / Xóa hoạt động

### Ngày 15/5 — Filter + Fix
- [ ] SearchBar + FilterBar
- [ ] Fix bug, kiểm tra LocalStorage

### Ngày 16/5 — Buffer + Demo
- [ ] Drag & drop (nếu kịp) hoặc nút Move
- [ ] Chuẩn bị demo

---

## ✅ ACCEPTANCE CRITERIA

Project đạt khi:

1. **Chạy được** — không có lỗi console khi dùng bình thường
2. **Giải thích được** — hiểu tại sao viết từng đoạn code
3. **Data persist** — refresh không mất task
4. **CRUD hoạt động** — thêm, sửa, xóa đúng
5. **Filter + Search hoạt động** — lọc đúng, tìm đúng

---

## 🚩 RỦI RO & CÁCH XỬ LÝ

| Rủi ro | Cách xử lý |
|---|---|
| Kéo thả `@dnd-kit` phức tạp | Làm nút "Move to →" trước, kéo thả là bonus |
| Bị stuck Tailwind class | Hỏi Sư Phụ, không mất quá 20 phút |
| Scope creep | Chỉ làm theo spec này, Phase 2 sau |
| Hết 16/5 chưa xong | Cắt Dashboard + DnD, giữ Kanban + CRUD là đủ |

---

## 📝 GHI CHÚ

- **Phase 2** (sau dấu mộc): Calendar view, thống kê nâng cao, backend sync
- Dùng `crypto.randomUUID()` để tạo id
- Commit thường xuyên: `feat:`, `fix:`, `style:`, `refactor:`
- **Không dùng** `any` type trong TypeScript

---

*Spec v1.0 tạo: 02/05/2026 · v1.1 cập nhật: 10/05/2026 · Tailwind thay CSS thuần*
