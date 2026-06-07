import React, { useCallback } from 'react'
import { hexWithAlpha } from '../../utils/chartColors'

export type SegmentedFieldProps<T extends string> = {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  getLabel: (value: T) => string
  ariaLabel: string
  getColor?: (value: T) => string
  renderIcon?: (value: T) => React.ReactNode
}

function SegmentedFieldInner<T extends string>({
  value,
  options,
  onChange,
  getLabel,
  ariaLabel,
  getColor,
  renderIcon,
}: SegmentedFieldProps<T>) {
  const selectedIndex = options.indexOf(value)

  const moveSelection = useCallback(
    (delta: number) => {
      const len = options.length
      if (len === 0) return
      const base = selectedIndex >= 0 ? selectedIndex : 0
      const next = (base + delta + len) % len
      onChange(options[next])
    },
    [options, onChange, selectedIndex],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        moveSelection(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        moveSelection(-1)
      }
    },
    [moveSelection],
  )

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="inline-flex flex-wrap gap-1 rounded-full border border-tk-border bg-neutral-50 p-0.5 dark:bg-neutral-800"
    >
      {options.map((opt) => {
        const selected = value === opt
        const color = getColor?.(opt)
        const activeStyle =
          selected && color
            ? {
                backgroundColor: hexWithAlpha(color, 0.18),
                borderColor: hexWithAlpha(color, 0.4),
              }
            : undefined

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt)}
            style={activeStyle}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
              selected
                ? color
                  ? 'border font-medium text-neutral-900 dark:text-neutral-100'
                  : 'border-transparent bg-tk-accent font-medium text-white'
                : 'border-transparent text-neutral-800 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {renderIcon?.(opt)}
            {getLabel(opt)}
          </button>
        )
      })}
    </div>
  )
}

export const SegmentedField = SegmentedFieldInner as <T extends string>(
  props: SegmentedFieldProps<T>,
) => React.ReactElement

export default SegmentedField
