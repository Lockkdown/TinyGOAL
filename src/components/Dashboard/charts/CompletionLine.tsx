import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../../hooks/useTheme'
import type { Task } from '../../../types'
import { getCompletionSeries, getCompletionWeekSeries } from '../../../utils/helpers'

type CompletionLineProps = {
  tasks: Task[]
}

type RangeMode = 'day' | 'week'

const TOOLTIP_STYLE_DARK = {
  backgroundColor: '#1e1e1e',
  border: '1px solid #2d2d2d',
  color: '#fafafa',
}

export const CompletionLine: React.FC<CompletionLineProps> = ({ tasks }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [range, setRange] = useState<RangeMode>('day')

  const gridColor = theme === 'dark' ? '#2d2d2d' : '#e5e5e5'
  const axisColor = theme === 'dark' ? '#737373' : '#525252'
  const lineColor = theme === 'dark' ? '#38bdf8' : '#0ea5e9'

  const series = useMemo(() => {
    const raw =
      range === 'day' ? getCompletionSeries(tasks, 7) : getCompletionWeekSeries(tasks, 8)

    return raw.map((point) => ({
      ...point,
      label:
        point.label === 'Today'
          ? t('chart.today')
          : point.label === 'This wk'
            ? t('chart.thisWeek')
            : point.label,
    }))
  }, [tasks, range, t])

  return (
    <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-tk-text-2">{t('dashboard.completionChart')}</h3>
          <p className="mt-0.5 text-xs text-tk-text-3">{t('dashboard.completionChartSubtitle')}</p>
        </div>
        <div className="flex rounded-md border border-tk-border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setRange('day')}
            aria-pressed={range === 'day'}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              range === 'day'
                ? 'bg-tk-accent text-white'
                : 'text-tk-text-2 hover:bg-tk-surface-hover'
            }`}
          >
            {t('dashboard.day')}
          </button>
          <button
            type="button"
            onClick={() => setRange('week')}
            aria-pressed={range === 'week'}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              range === 'week'
                ? 'bg-tk-accent text-white'
                : 'text-tk-text-2 hover:bg-tk-surface-hover'
            }`}
          >
            {t('dashboard.week')}
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke={axisColor} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke={axisColor} />
          <Tooltip contentStyle={theme === 'dark' ? TOOLTIP_STYLE_DARK : undefined} />
          <Line
            type="monotone"
            dataKey="count"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 4, fill: lineColor }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CompletionLine
