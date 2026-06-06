import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React, { useState } from 'react'
import type { TaskListItemProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const OVERDUE_CLASS = 'text-red-400'

export const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const isDone = task.status === 'Done'
  const [initialStatus] = useState(task.status)
  const skipStrikeTransition = initialStatus === 'Done' && task.status === 'Done'

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : 'text-slate-400'
  const style =
    transform != null ? { transform: CSS.Transform.toString(transform) } : undefined

  const titleStrikeClasses = skipStrikeTransition
    ? isDone
      ? 'text-slate-500 opacity-70 after:w-full'
      : 'text-slate-900 after:w-0'
    : `transition-opacity duration-300 motion-reduce:transition-none ${
        isDone ? 'text-slate-500 opacity-70 after:w-full' : 'text-slate-900 after:w-0'
      } after:transition-[width] after:duration-300 after:ease-out motion-reduce:after:transition-none`

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative flex cursor-grab items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 touch-none active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
      aria-label={`Drag "${task.title}"`}
      {...listeners}
      {...attributes}
    >
      <span className="shrink-0 text-slate-400" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        </svg>
      </span>
      <span
        className={`relative inline-block min-w-0 flex-1 truncate text-left text-sm font-medium after:absolute after:top-1/2 after:left-0 after:h-px after:bg-current ${titleStrikeClasses}`}
      >
        {task.title}
      </span>
      <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
        <span className={deadlineClasses}>{formatDeadline(task.deadline)}</span>
        <span aria-hidden="true">·</span>
        <span>{task.category}</span>
      </div>
    </li>
  )
}

export default TaskListItem
