"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ClipboardList } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { Task, TaskStatus } from "@/entities/task"
import { TaskCard } from "./TaskCard"

interface TaskColumnProps {
  columnId: string
  title: string
  tasks: Task[]
  emptyLabel?: string
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 select-none">
      <ClipboardList className="h-7 w-7 text-muted-foreground/30" />
      <p className="text-xs text-muted-foreground/60">{label}</p>
    </div>
  )
}

export function TaskColumn({ columnId, title, tasks, emptyLabel = "No tasks here", onEdit, onDelete, onStatusChange }: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: columnId })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 min-h-[200px] rounded-xl p-2 transition-colors",
          isOver ? "bg-muted/70 ring-2 ring-primary/20" : "bg-muted/30"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <EmptyState label={emptyLabel} />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
