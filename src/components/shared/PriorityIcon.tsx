import React from 'react'
import type { Priority } from '../../types'

const PRIORITY_ICON_CLASSES: Record<Priority, string> = {
  Low: 'text-green-500',
  Medium: 'text-yellow-500',
  High: 'text-red-500',
}

type PriorityIconProps = {
  priority: Priority
}

const PriorityBars: React.FC<{ priority: Priority; className: string }> = ({
  priority,
  className,
}) => {
  if (priority === 'Low') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <rect x="2" y="10" width="3" height="4" rx="0.5" />
      </svg>
    )
  }

  if (priority === 'Medium') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <rect x="2" y="10" width="3" height="4" rx="0.5" />
        <rect x="6.5" y="6" width="3" height="8" rx="0.5" />
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="10" width="3" height="4" rx="0.5" />
      <rect x="6.5" y="6" width="3" height="8" rx="0.5" />
      <rect x="11" y="2" width="3" height="12" rx="0.5" />
    </svg>
  )
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({ priority }) => {
  return (
    <span
      className={`inline-flex shrink-0 items-center ${PRIORITY_ICON_CLASSES[priority]}`}
      aria-label={priority}
      title={priority}
    >
      <PriorityBars priority={priority} className="h-4 w-4" />
    </span>
  )
}

export default PriorityIcon
