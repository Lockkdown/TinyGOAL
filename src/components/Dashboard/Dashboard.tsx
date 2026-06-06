import React from 'react'
import { useTranslation } from 'react-i18next'
import type { DashboardProps } from '../../types'
import CompletionLine from './charts/CompletionLine'
import PriorityDonut from './charts/PriorityDonut'
import StatusDonut from './charts/StatusDonut'

export const Dashboard: React.FC<DashboardProps> = ({ stats, tasks }) => {
  const { t } = useTranslation()

  const statTiles: { key: string; label: string; value: number; accent?: string }[] = [
    { key: 'total', label: t('dashboard.totalTasks'), value: stats.total },
    {
      key: 'todo',
      label: t('dashboard.todo'),
      value: stats.todo,
      accent: 'text-neutral-500 dark:text-neutral-400',
    },
    {
      key: 'inProgress',
      label: t('dashboard.inProgress'),
      value: stats.inProgress,
      accent: 'text-blue-500 dark:text-blue-400',
    },
    {
      key: 'done',
      label: t('dashboard.done'),
      value: stats.done,
      accent: 'text-green-500 dark:text-green-400',
    },
    {
      key: 'overdue',
      label: t('dashboard.overdue'),
      value: stats.overdue,
      accent: 'text-red-500 dark:text-red-400',
    },
  ]

  return (
    <section className="space-y-6 py-6" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="text-lg font-semibold text-tk-text-1">
        {t('dashboard.overview')}
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {statTiles.map(({ key, label, value, accent }) => (
          <div
            key={key}
            className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-tk-text-3">{label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${accent ?? 'text-tk-text-1'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-tk-text-2">{t('dashboard.completionRate')}</p>
          <span className="text-sm font-semibold text-tk-text-1 tabular-nums">
            {stats.completionRate}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.completionRate}%`,
              backgroundColor: 'rgb(var(--tk-accent))',
              transition: 'width 300ms ease-out',
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusDonut stats={stats} />
        <PriorityDonut stats={stats} />
      </div>

      <CompletionLine tasks={tasks} />
    </section>
  )
}

export default Dashboard
