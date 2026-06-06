import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../../../hooks/useTheme'
import type { Status, TaskStats } from '../../../types'
import {
  STATUS_CHART_COLORS,
  STATUS_CHART_COLORS_DARK,
} from '../../../utils/chartColors'

const STATUS_KEYS: Status[] = ['Todo', 'In Progress', 'Done']

const TOOLTIP_STYLE_DARK = {
  backgroundColor: '#1e1e1e',
  border: '1px solid #2d2d2d',
  color: '#fafafa',
}

const LEGEND_TEXT_COLOR = {
  light: '#171717',
  dark: '#fafafa',
} as const

type StatusDonutProps = {
  stats: TaskStats
}

export const StatusDonut: React.FC<StatusDonutProps> = ({ stats }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? STATUS_CHART_COLORS_DARK : STATUS_CHART_COLORS

  const data = STATUS_KEYS.map((key) => ({
    key,
    name: t(`status.${key}`),
    value: key === 'Todo' ? stats.todo : key === 'In Progress' ? stats.inProgress : stats.done,
  }))

  return (
    <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-tk-text-2">{t('dashboard.statusChart')}</h3>
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

export default StatusDonut
