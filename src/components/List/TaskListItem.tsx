import { useDraggable } from '@dnd-kit/core'
import React, { useState } from 'react'
import CategoryBadge from '../shared/CategoryBadge'
import PriorityIcon from '../shared/PriorityIcon'
import type { TaskListItemProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const OVERDUE_CLASS = 'text-red-400'

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  isOverlay = false,
  onOpenTask,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  })

  const isDone = task.status === 'Done'
  const [initialStatus] = useState(task.status)
  const skipStrikeTransition = initialStatus === 'Done' && task.status === 'Done'

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : 'text-slate-400'

  const titleStrikeClasses = skipStrikeTransition
    ? isDone
      ? 'text-slate-500 opacity-70 after:w-full'
      : 'text-slate-900 after:w-0'
    : `transition-opacity duration-300 motion-reduce:transition-none ${
        isDone ? 'text-slate-500 opacity-70 after:w-full' : 'text-slate-900 after:w-0'
      } after:transition-[width] after:duration-300 after:ease-out motion-reduce:after:transition-none`

  const overlayClasses = isOverlay
    ? 'cursor-grabbing shadow-lg ring-1 ring-slate-200 pointer-events-none'
    : ''

  const draggingClasses = !isOverlay && isDragging ? 'opacity-40' : ''

  return (
    <li
      ref={isOverlay ? undefined : setNodeRef}
      className={`relative flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 touch-none active:cursor-grabbing ${overlayClasses} ${draggingClasses}`}
      aria-label={isOverlay ? undefined : `Drag "${task.title}"`}
      onClick={isOverlay ? undefined : () => onOpenTask(task)}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
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
      <div
        className={`flex shrink-0 items-center gap-2 text-xs text-slate-400 ${isDone ? 'opacity-60' : ''}`}
      >
        <span className={deadlineClasses}>{formatDeadline(task.deadline)}</span>
        <span aria-hidden="true">·</span>
        <CategoryBadge category={task.category} />
      </div>
      <div className={isDone ? 'opacity-60' : ''}>
        <PriorityIcon priority={task.priority} />
      </div>
    </li>
  )
}

export default TaskListItem
