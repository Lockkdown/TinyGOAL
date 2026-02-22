"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/lib/utils"
import type { Task, TaskStatus } from "@/entities/task"
import { TASK_PRIORITY_LABELS } from "@/shared/config/constants"
import { TaskActions } from "./TaskActions"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

const PRIORITY_CONFIG: Record<number, { className: string }> = {
  0: { className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  1: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  2: { className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
  3: { className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
}

const STATUS_CONFIG: Record<TaskStatus, { cardClass: string; titleClass: string; isTerminal: boolean }> = {
  BACKLOG:     { cardClass: "",                           titleClass: "",            isTerminal: false },
  TODAY:       { cardClass: "border-l-4 border-l-primary",  titleClass: "",            isTerminal: false },
  IN_PROGRESS: { cardClass: "border-l-4 border-l-blue-500", titleClass: "",            isTerminal: false },
  DONE:        { cardClass: "border-l-4 border-l-green-500", titleClass: "line-through", isTerminal: true  },
  CANCELLED:   { cardClass: "border-l-4 border-l-destructive", titleClass: "line-through", isTerminal: true },
}

function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null
  return new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getDueDateClass(dueDate: string | null, status: TaskStatus): string {
  if (!dueDate || status === "DONE" || status === "CANCELLED") return "text-muted-foreground"
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  if (due < today) return "text-destructive"
  if (due.getTime() === today.getTime()) return "text-amber-500 dark:text-amber-400"
  return "text-muted-foreground"
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = { transform: CSS.Transform.toString(transform), transition }
  const priorityConfig = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG[0]
  const priorityLabel = TASK_PRIORITY_LABELS[task.priority] ?? TASK_PRIORITY_LABELS[0]
  const statusConfig = STATUS_CONFIG[task.status]
  const formattedDate = formatDueDate(task.dueDate)
  const dueDateClass = getDueDateClass(task.dueDate, task.status)

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        {...listeners}
        className={cn(
          "group cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-300 select-none overflow-hidden",
          statusConfig.cardClass,
          isDragging && "opacity-50 shadow-lg rotate-1"
        )}
        onClick={() => onEdit(task)}
      >
        <CardContent
          className={cn(
            "p-3 transition-opacity duration-300",
            statusConfig.isTerminal && "opacity-60"
          )}
        >
          <div className="flex items-start gap-2">
            {statusConfig.isTerminal && (
              <div className="mt-0.5 shrink-0 animate-in fade-in zoom-in-50 duration-300">
                {task.status === "DONE"
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-destructive/70" />
                }
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium leading-snug line-clamp-2 transition-all duration-300",
                statusConfig.titleClass,
                statusConfig.isTerminal && "text-muted-foreground"
              )}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="secondary" className={cn("text-xs px-1.5 py-0 border-0", priorityConfig.className)}>
                  {priorityLabel}
                </Badge>
                {formattedDate && (
                  <span className={cn("flex items-center gap-1 text-xs", dueDateClass)}>
                    <CalendarDays className="h-3 w-3" />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <TaskActions
                status={task.status}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
                onStatusChange={(status) => onStatusChange(task.id, status)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
