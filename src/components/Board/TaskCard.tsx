import { useDraggable } from '@dnd-kit/core'
import React, { useState } from 'react'
import CategoryBadge from '../shared/CategoryBadge'
import PriorityIcon from '../shared/PriorityIcon'
import type { TaskCardProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const OVERDUE_CLASS = 'text-red-500 font-medium'

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  })

  const isDone = task.status === 'Done'
  const [initialStatus] = useState(task.status)
  const skipDoneTransition = initialStatus === 'Done' && isDone

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : 'text-slate-600'

  const cardDoneClasses = isDone
    ? 'border-slate-100 bg-slate-50 opacity-70 shadow-none'
    : 'border-slate-200 bg-white shadow-sm'

  const cardTransitionClasses = skipDoneTransition
    ? ''
    : 'transition-[opacity,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none'

  const titleStrikeClasses = skipDoneTransition
    ? isDone
      ? 'text-slate-500 after:w-full'
      : 'text-slate-900 after:w-0'
    : `transition-opacity duration-300 motion-reduce:transition-none ${
        isDone ? 'text-slate-500 after:w-full' : 'text-slate-900 after:w-0'
      } after:transition-[width] after:duration-300 after:ease-out motion-reduce:after:transition-none`

  const overlayClasses = isOverlay
    ? 'cursor-grabbing shadow-lg ring-1 ring-slate-200 pointer-events-none'
    : ''

  const draggingClasses = !isOverlay && isDragging ? 'opacity-40' : ''

  return (
    <li
      ref={isOverlay ? undefined : setNodeRef}
      className={`relative list-none touch-none rounded-lg border p-3 ${cardDoneClasses} ${cardTransitionClasses} ${overlayClasses} ${draggingClasses}`}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
    >
      <div className={`flex flex-col gap-2 ${isDone ? 'opacity-90' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`relative min-w-0 flex-1 text-sm font-semibold after:absolute after:top-1/2 after:left-0 after:h-px after:bg-current ${titleStrikeClasses}`}
          >
            {task.title}
          </h3>
          <div
            className={`flex shrink-0 items-center gap-1.5 ${isDone ? 'opacity-60' : ''}`}
          >
            <CategoryBadge category={task.category} />
            <PriorityIcon priority={task.priority} />
          </div>
        </div>
        <p className={`text-xs ${isDone ? 'text-slate-400' : deadlineClasses}`}>
          {formatDeadline(task.deadline)}
        </p>
        {!isOverlay && (
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
        )}
      </div>
    </li>
  )
}

export default TaskCard
