import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Priority, TaskStats } from '../../../types'

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#ef4444',
}

type PriorityDonutProps = {
  stats: TaskStats
}

export const PriorityDonut: React.FC<PriorityDonutProps> = ({ stats }) => {
  const data: { name: Priority; value: number }[] = [
    { name: 'Low', value: stats.byPriority.Low },
    { name: 'Medium', value: stats.byPriority.Medium },
    { name: 'High', value: stats.byPriority.High },
  ]

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-700">Tasks by priority</h3>
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
              <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
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
