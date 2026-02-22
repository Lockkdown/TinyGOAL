"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { TaskColumn, TaskForm, useTasks } from "@/features/tasks"
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from "@/entities/task"

const COLUMN_TODAY = "today"
const COLUMN_BACKLOG = "backlog"
const COLUMN_DONE = "done"
const COLUMN_CANCEL = 'cancel'
const TODAY_STATUSES = new Set(["TODAY", "IN_PROGRESS"])
const BACKLOG_STATUSES = new Set(["BACKLOG"])
const DONE_STATUSES = new Set(["DONE"])
const CANCEL_STATUSES = new Set(["CANCELLED"])

const COLUMN_STATUS_MAP: Record<string, TaskStatus> = {
  [COLUMN_TODAY]: "TODAY",
  [COLUMN_BACKLOG]: "BACKLOG",
  [COLUMN_DONE]: "DONE",
  [COLUMN_CANCEL]: "CANCELLED",
}

function TaskOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-card border rounded-lg p-3 shadow-xl rotate-1 opacity-90 cursor-grabbing">
      <p className="text-sm font-medium">{task.title}</p>
    </div>
  )
}

function TaskBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
          <div className="flex flex-col gap-2 min-h-[200px] bg-muted/30 rounded-xl p-2">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskBoardError() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p className="text-sm text-muted-foreground">Failed to load tasks. Please refresh the page.</p>
    </div>
  )
}

export function TaskBoard() {
  const { tasks, isLoading, hasError, addTask, editTask, removeTask, reorderTasks } = useTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const todayTasks = tasks.filter((t) => TODAY_STATUSES.has(t.status))
  const backlogTasks = tasks.filter((t) => BACKLOG_STATUSES.has(t.status))
  const doneTasks = tasks.filter((t) => DONE_STATUSES.has(t.status))
  const cancelTasks = tasks.filter((t) => CANCEL_STATUSES.has(t.status))
  const activeTask = activeId ? (tasks.find((t) => t.id === activeId) ?? null) : null

  function openCreateForm(): void {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  function openEditForm(task: Task): void {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  function handleDragStart(event: DragStartEvent): void {
    setActiveId(String(event.active.id))
  }

  function handleDropOnColumn(activeTaskId: string, columnId: string): void {
    const newStatus = COLUMN_STATUS_MAP[columnId]
    if (!newStatus) return
    const task = tasks.find((t) => t.id === activeTaskId)
    if (task && task.status !== newStatus) {
      editTask(activeTaskId, { status: newStatus })
    }
  }

  function handleDropOnTask(activeTaskId: string, overTaskId: string): void {
    const draggedTask = tasks.find((t) => t.id === activeTaskId)
    const targetTask = tasks.find((t) => t.id === overTaskId)
    if (!draggedTask || !targetTask) return

    if (draggedTask.status !== targetTask.status) {
      editTask(activeTaskId, { status: targetTask.status })
      return
    }

    const reordered = arrayMove(tasks, tasks.indexOf(draggedTask), tasks.indexOf(targetTask))
    reorderTasks(reordered)
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeTaskId = String(active.id)
    const overId = String(over.id)
    const isOverColumn = overId in COLUMN_STATUS_MAP

    if (isOverColumn) {
      handleDropOnColumn(activeTaskId, overId)
      return
    }

    handleDropOnTask(activeTaskId, overId)
  }

  function handleStatusChange(id: string, status: TaskStatus): void {
    editTask(id, { status })
  }

  async function handleFormSubmit(data: CreateTaskInput | UpdateTaskInput): Promise<void> {
    if (editingTask) {
      await editTask(editingTask.id, data as UpdateTaskInput)
    } else {
      await addTask(data as CreateTaskInput)
    }
  }

  if (isLoading) return <TaskBoardSkeleton />
  if (hasError) return <TaskBoardError />

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskColumn
            columnId={COLUMN_TODAY}
            title="Today"
            tasks={todayTasks}
            onEdit={openEditForm}
            onDelete={removeTask}
            emptyLabel="No tasks for today"
            onStatusChange={handleStatusChange}
          />
          <TaskColumn
            columnId={COLUMN_BACKLOG}
            title="Backlog"
            tasks={backlogTasks}
            onEdit={openEditForm}
            onDelete={removeTask}
            emptyLabel="Backlog is empty"
            onStatusChange={handleStatusChange}
          />
          <TaskColumn
            columnId={COLUMN_DONE}
            title="Done"
            tasks={doneTasks}
            onEdit={openEditForm}
            onDelete={removeTask}
            emptyLabel="No completed tasks"
            onStatusChange={handleStatusChange}
          />
          <TaskColumn
            columnId={COLUMN_CANCEL}
            title="Cancelled"
            tasks={cancelTasks}
            onEdit={openEditForm}
            onDelete={removeTask}
            emptyLabel="No cancelled tasks"
            onStatusChange={handleStatusChange}
          />
        </div>
        <DragOverlay>{activeTask && <TaskOverlay task={activeTask} />}</DragOverlay>
      </DndContext>

      <Button
        size="sm"
        className="fixed bottom-6 right-6 shadow-lg gap-2 rounded-full px-4"
        onClick={openCreateForm}
      >
        <Plus className="h-4 w-4" />
        Add Task
      </Button>

      <TaskForm
        open={isFormOpen}
        task={editingTask}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
