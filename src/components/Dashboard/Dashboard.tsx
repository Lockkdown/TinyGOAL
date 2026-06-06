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
    { key: 'todo', label: t('dashboard.todo'), value: stats.todo, accent: 'text-slate-700' },
    {
      key: 'inProgress',
      label: t('dashboard.inProgress'),
      value: stats.inProgress,
      accent: 'text-blue-700',
    },
    { key: 'done', label: t('dashboard.done'), value: stats.done, accent: 'text-green-700' },
    {
      key: 'overdue',
      label: t('dashboard.overdue'),
      value: stats.overdue,
      accent: 'text-red-600',
    },
  ]

  return (
    <section className="space-y-6 py-6" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="text-lg font-semibold text-slate-900">
        {t('dashboard.overview')}
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {statTiles.map(({ key, label, value, accent }) => (
          <div
            key={key}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${accent ?? 'text-slate-900'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-700">{t('dashboard.completionRate')}</p>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">
            {stats.completionRate}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full min-w-0 rounded-full bg-blue-600 transition-[width] duration-300 ease-out"
            style={{ width: `${stats.completionRate}%` }}
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
