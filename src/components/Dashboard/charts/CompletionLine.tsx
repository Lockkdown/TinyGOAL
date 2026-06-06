import React, { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Task } from '../../../types'
import { getCompletionSeries, getCompletionWeekSeries } from '../../../utils/helpers'

type CompletionLineProps = {
  tasks: Task[]
}

type RangeMode = 'day' | 'week'

export const CompletionLine: React.FC<CompletionLineProps> = ({ tasks }) => {
  const [range, setRange] = useState<RangeMode>('day')

  const series = useMemo(
    () => (range === 'day' ? getCompletionSeries(tasks, 7) : getCompletionWeekSeries(tasks, 8)),
    [tasks, range],
  )

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-slate-700">Recent completion curve</h3>
        <div className="flex rounded-md border border-slate-200 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setRange('day')}
            aria-pressed={range === 'day'}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              range === 'day'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setRange('week')}
            aria-pressed={range === 'week'}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              range === 'week'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Week
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2563eb' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CompletionLine
