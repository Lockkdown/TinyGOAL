import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import type { Priority, TaskCardProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const PRIORITY_CLASSES: Record<Priority, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
}

const OVERDUE_CLASS = 'text-red-500 font-medium'

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : 'text-slate-600'
  const style =
    transform != null ? { transform: CSS.Transform.toString(transform) } : undefined

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`list-none touch-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
          <span
            className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASSES[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <p className="text-xs text-slate-500">{task.category}</p>
        <p className={`text-xs ${deadlineClasses}`}>{formatDeadline(task.deadline)}</p>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

export default TaskCard
