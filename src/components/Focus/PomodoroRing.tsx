import React from 'react'

const RADIUS = 100
const CX = 120
const CY = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type PomodoroRingProps = {
  progress: number
  label: string
  variant?: 'focus' | 'break'
}

export const PomodoroRing: React.FC<PomodoroRingProps> = ({
  progress,
  label,
  variant = 'focus',
}) => {
  const clamped = Math.min(1, Math.max(0, progress))
  const dashOffset = CIRCUMFERENCE * (1 - clamped)
  const strokeColor =
    variant === 'break'
      ? 'rgb(var(--tk-text-3))'
      : 'rgb(var(--tk-accent))'

  return (
    <div className="relative mx-auto h-60 w-60">
      <svg
        viewBox="0 0 240 240"
        className="h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          className="stroke-neutral-200 dark:stroke-neutral-700"
        />
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CX} ${CY})`}
          className="transition-[stroke-dashoffset] duration-300 motion-reduce:transition-none"
          style={{ stroke: strokeColor }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-4xl font-semibold tabular-nums text-tk-text-1"
        aria-hidden="true"
      >
        {label}
      </div>
    </div>
  )
}

export default PomodoroRing
