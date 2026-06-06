import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Priority, TaskStats } from '../../../types'

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#ef4444',
}

const PRIORITY_KEYS: Priority[] = ['Low', 'Medium', 'High']

type PriorityDonutProps = {
  stats: TaskStats
}

export const PriorityDonut: React.FC<PriorityDonutProps> = ({ stats }) => {
  const { t } = useTranslation()

  const data = PRIORITY_KEYS.map((key) => ({
    key,
    name: t(`priority.${key}`),
    value: stats.byPriority[key],
  }))

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-700">{t('dashboard.priorityChart')}</h3>
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
              <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriorityDonut
