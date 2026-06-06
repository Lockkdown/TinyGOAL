import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../../../hooks/useTheme'
import type { Priority, TaskStats } from '../../../types'

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
}

const PRIORITY_COLORS_DARK: Record<Priority, string> = {
  Low: '#4ade80',
  Medium: '#fbbf24',
  High: '#f87171',
}

const PRIORITY_KEYS: Priority[] = ['Low', 'Medium', 'High']

const TOOLTIP_STYLE_DARK = {
  backgroundColor: '#1e1e1e',
  border: '1px solid #2d2d2d',
  color: '#fafafa',
}

const LEGEND_TEXT_COLOR = {
  light: '#171717',
  dark: '#fafafa',
} as const

type PriorityDonutProps = {
  stats: TaskStats
}

export const PriorityDonut: React.FC<PriorityDonutProps> = ({ stats }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? PRIORITY_COLORS_DARK : PRIORITY_COLORS

  const data = PRIORITY_KEYS.map((key) => ({
    key,
    name: t(`priority.${key}`),
    value: stats.byPriority[key],
  }))

  return (
    <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-tk-text-2">{t('dashboard.priorityChart')}</h3>
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
              <Cell key={entry.key} fill={colors[entry.key]} />
            ))}
          </Pie>
          <Tooltip contentStyle={theme === 'dark' ? TOOLTIP_STYLE_DARK : undefined} />
          <Legend wrapperStyle={{ color: LEGEND_TEXT_COLOR[theme] }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriorityDonut
