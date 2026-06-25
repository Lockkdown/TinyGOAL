import React from 'react'

export type ChartTooltipContentProps = {
  label?: string | number
  value: number
  formatValue: (value: number) => string
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  label,
  value,
  formatValue,
}) => {
  const labelText = label != null && label !== '' ? String(label) : null

  return (
    <div
      className="pointer-events-none rounded-md border px-2.5 py-1.5 text-xs shadow-lg"
      style={{
        backgroundColor: 'rgb(var(--tk-surface))',
        borderColor: 'rgb(var(--tk-border))',
        color: 'rgb(var(--tk-text-1))',
      }}
    >
      {labelText != null && (
        <p
          className="mb-0.5 text-[11px] font-medium leading-tight"
          style={{ color: 'rgb(var(--tk-text-2))' }}
        >
          {labelText}
        </p>
      )}
      <p className="text-sm font-semibold tabular-nums leading-tight">{formatValue(value)}</p>
    </div>
  )
}
