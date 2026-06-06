import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Priority } from '../../types'

const PRIORITY_ICON_CLASSES: Record<Priority, string> = {
  Low: 'text-green-500',
  Medium: 'text-yellow-500',
  High: 'text-red-500',
}

type PriorityIconProps = {
  priority: Priority
}

const PRIORITY_BAR_COUNT: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
}

const PRIORITY_BARS = [
  { x: 2, y: 10, width: 3, height: 4 },
  { x: 6.5, y: 6, width: 3, height: 8 },
  { x: 11, y: 2, width: 3, height: 12 },
] as const

const ACTIVE_BAR_CLASS = 'fill-current'
const INACTIVE_BAR_CLASS = 'fill-neutral-300 dark:fill-neutral-500'

const PriorityBars: React.FC<{ priority: Priority; className: string }> = ({
  priority,
  className,
}) => {
  const activeCount = PRIORITY_BAR_COUNT[priority]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
    >
      {PRIORITY_BARS.map((bar, index) => (
        <rect
          key={index}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx="0.5"
          className={index < activeCount ? ACTIVE_BAR_CLASS : INACTIVE_BAR_CLASS}
        />
      ))}
    </svg>
  )
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({ priority }) => {
  const { t } = useTranslation()
  const label = t(`priority.${priority}`)

  return (
    <span
      className={`inline-flex shrink-0 items-center ${PRIORITY_ICON_CLASSES[priority]}`}
      aria-label={label}
      title={label}
    >
      <PriorityBars priority={priority} className="h-4 w-4" />
    </span>
  )
}

export default PriorityIcon
