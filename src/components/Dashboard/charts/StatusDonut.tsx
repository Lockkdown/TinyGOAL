import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Status, TaskStats } from '../../../types'

const STATUS_COLORS: Record<Status, string> = {
  Todo: '#64748b',
  'In Progress': '#2563eb',
  Done: '#16a34a',
}

const STATUS_KEYS: Status[] = ['Todo', 'In Progress', 'Done']

type StatusDonutProps = {
  stats: TaskStats
}

export const StatusDonut: React.FC<StatusDonutProps> = ({ stats }) => {
  const { t } = useTranslation()

  const data = STATUS_KEYS.map((key) => ({
    key,
    name: t(`status.${key}`),
    value: key === 'Todo' ? stats.todo : key === 'In Progress' ? stats.inProgress : stats.done,
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-700">{t('dashboard.statusChart')}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusDonut
