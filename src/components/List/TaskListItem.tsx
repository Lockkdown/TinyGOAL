import { useDraggable } from '@dnd-kit/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategoryBadge from '../shared/CategoryBadge'
import PriorityIcon from '../shared/PriorityIcon'
import type { TaskListItemProps } from '../../types'
import { formatCompletedAt, formatDeadline, isOverdue } from '../../utils/helpers'

const OVERDUE_CLASS = 'font-medium text-red-500 dark:text-red-400'
const DEADLINE_CLASS = 'text-tk-text-2'
const META_MUTED_CLASS = 'text-tk-text-3'

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  isOverlay = false,
  onOpenTask,
}) => {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  })

  const isDone = task.status === 'Done'
  const [initialStatus] = useState(task.status)
  const skipStrikeTransition = initialStatus === 'Done' && task.status === 'Done'

  const deadlineClasses = isOverdue(task) ? OVERDUE_CLASS : DEADLINE_CLASS

  const titleStrikeClasses = skipStrikeTransition
    ? isDone
      ? 'text-tk-text-2 line-through'
      : 'text-tk-text-1'
    : `transition-colors duration-300 motion-reduce:transition-none ${
        isDone ? 'text-tk-text-2 line-through' : 'text-tk-text-1'
      }`

  const overlayClasses = isOverlay
    ? 'cursor-grabbing bg-tk-surface shadow-lg ring-1 ring-tk-border pointer-events-none'
    : ''

  const draggingClasses = !isOverlay && isDragging ? 'opacity-40' : ''

  return (
    <li
      ref={isOverlay ? undefined : setNodeRef}
      className={`relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 touch-none active:cursor-grabbing ${overlayClasses} ${draggingClasses}`}
      aria-label={isOverlay ? undefined : t('a11y.dragTask', { title: task.title })}
      onClick={isOverlay ? undefined : () => onOpenTask(task)}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
    >
      <span className={`shrink-0 ${META_MUTED_CLASS}`} aria-hidden="true">
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
        className={`min-w-0 flex-1 truncate text-left text-sm font-medium ${titleStrikeClasses}`}
      >
        {task.title}
      </span>
      <div
        className={`flex shrink-0 items-center gap-2 text-xs ${isDone ? 'opacity-75' : ''}`}
      >
        <span className={isDone ? 'text-tk-text-2' : deadlineClasses}>
          {isDone && task.completedAt
            ? t('task.completedOn', { date: formatCompletedAt(task.completedAt) })
            : formatDeadline(task.deadline)}
        </span>
        <span className={META_MUTED_CLASS} aria-hidden="true">
          ·
        </span>
        <CategoryBadge category={task.category} />
      </div>
      <div className={isDone ? 'opacity-75' : ''}>
        <PriorityIcon priority={task.priority} />
      </div>
    </li>
  )
}

export default TaskListItem
