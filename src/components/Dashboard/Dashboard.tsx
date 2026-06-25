import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DashboardProps } from '../../types'
import CompletionLine from './charts/CompletionLine'
import FocusLine from './charts/FocusLine'
import PriorityDonut from './charts/PriorityDonut'
import StatusDonut from './charts/StatusDonut'
import { getFocusSeries } from '../../utils/helpers'

export const Dashboard: React.FC<DashboardProps> = ({ stats, tasks, sessions }) => {
  const { t } = useTranslation()

  const focusSeries = useMemo(() => getFocusSeries(sessions, 7), [sessions])
  const focusTotalMinutes = useMemo(
    () => focusSeries.reduce((sum, point) => sum + point.count, 0),
    [focusSeries],
  )
  const focusTotalSessions = useMemo(() => {
    const dateKeys = new Set(focusSeries.map((point) => point.date))
    return sessions.filter((session) => dateKeys.has(session.date)).length
  }, [sessions, focusSeries])

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
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-300 dark:bg-neutral-800">
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

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-tk-text-1">{t('dashboard.focusTime')}</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
            <p className="text-xs font-medium text-tk-text-3">{t('dashboard.focusMinutes')}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-tk-text-1">{focusTotalMinutes}</p>
          </div>
          <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
            <p className="text-xs font-medium text-tk-text-3">{t('dashboard.focusSessions')}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-tk-text-1">{focusTotalSessions}</p>
          </div>
        </div>
        <FocusLine sessions={sessions} />
      </div>
    </section>
  )
}

export default Dashboard
