import { useDraggable } from '@dnd-kit/core'
import React, { useState } from 'react'
import CategoryBadge from '../shared/CategoryBadge'
import PriorityIcon from '../shared/PriorityIcon'
import type { TaskCardProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const OVERDUE_CLASS = 'font-medium text-red-500 dark:text-red-400'
const DEADLINE_CLASS = 'text-tk-text-2'

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onOpenTask,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  })

  const isDone = task.status === 'Done'
  const [initialStatus] = useState(task.status)
  const skipDoneTransition = initialStatus === 'Done' && isDone

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : DEADLINE_CLASS

  const cardDoneClasses = isDone
    ? 'border-tk-border-subtle bg-tk-surface-hover shadow-none'
    : 'border-tk-border bg-tk-surface shadow-sm'

  const cardTransitionClasses = skipDoneTransition
    ? ''
    : 'transition-[opacity,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none'

  const titleStrikeClasses = skipDoneTransition
    ? isDone
      ? 'text-tk-text-2 line-through'
      : 'text-tk-text-1'
    : `transition-colors duration-300 motion-reduce:transition-none ${
        isDone ? 'text-tk-text-2 line-through' : 'text-tk-text-1'
      }`

  const overlayClasses = isOverlay
    ? 'cursor-grabbing shadow-lg ring-1 ring-tk-border pointer-events-none'
    : ''

  const draggingClasses = !isOverlay && isDragging ? 'opacity-40' : ''

  return (
    <li
      ref={isOverlay ? undefined : setNodeRef}
      className={`relative list-none touch-none cursor-pointer rounded-lg border p-3 ${cardDoneClasses} ${cardTransitionClasses} ${overlayClasses} ${draggingClasses}`}
      onClick={isOverlay ? undefined : () => onOpenTask(task)}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`min-w-0 flex-1 text-sm font-semibold ${titleStrikeClasses}`}
          >
            {task.title}
          </h3>
          <div
            className={`flex shrink-0 items-center gap-1.5 ${isDone ? 'opacity-75' : ''}`}
          >
            <CategoryBadge category={task.category} />
            <PriorityIcon priority={task.priority} />
          </div>
        </div>
        <p className={`text-xs ${deadlineClasses} ${isDone ? 'opacity-75' : ''}`}>
          {formatDeadline(task.deadline)}
        </p>
      </div>
    </li>
  )
}

export default TaskCard
