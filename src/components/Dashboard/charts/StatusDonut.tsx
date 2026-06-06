import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TaskStats } from '../../../types'

const STATUS_COLORS: Record<string, string> = {
  Todo: '#64748b',
  'In Progress': '#2563eb',
  Done: '#16a34a',
}

type StatusDonutProps = {
  stats: TaskStats
}

export const StatusDonut: React.FC<StatusDonutProps> = ({ stats }) => {
  const data = [
    { name: 'Todo', value: stats.todo },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Done', value: stats.done },
  ]

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-700">Tasks by status</h3>
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
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
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
