import React from 'react'
import type { AppTheme } from '../../types'
import { getRingColor, hexWithAlpha } from '../../utils/chartColors'

const RADIUS = 125
const CX = 150
const CY = 150
const STROKE = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type PomodoroRingProps = {
  progress: number
  label: string
  variant?: 'focus' | 'break'
  theme: AppTheme
}

export const PomodoroRing: React.FC<PomodoroRingProps> = ({
  progress,
  label,
  variant = 'focus',
  theme,
}) => {
  const clamped = Math.min(1, Math.max(0, progress))
  const dashOffset = CIRCUMFERENCE * (1 - clamped)
  const strokeColor = getRingColor(progress, variant, theme)

  return (
    <div className="relative mx-auto h-72 w-72">
      <svg
        viewBox="0 0 300 300"
        className="h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-neutral-100 dark:stroke-neutral-800"
        />
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CX} ${CY})`}
          className="transition-[stroke-dashoffset,stroke] duration-300 motion-reduce:transition-none"
          style={{
            stroke: strokeColor,
            filter: `drop-shadow(0 0 6px ${hexWithAlpha(strokeColor, 0.45)})`,
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-5xl font-semibold tabular-nums text-tk-text-1"
        aria-hidden="true"
      >
        {label}
      </div>
    </div>
  )
}

export default PomodoroRing
