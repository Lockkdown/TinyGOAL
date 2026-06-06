import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import type { ColumnProps } from '../../types'
import {
  CHART_BADGE_BG_ALPHA,
  CHART_BADGE_TEXT_CLASSES,
  getStatusChartColor,
  hexWithAlpha,
} from '../../utils/chartColors'
import TaskCard from './TaskCard'

export const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onOpenTask,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const statusColor = getStatusChartColor(status, theme)

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[200px] flex-col rounded-lg border border-tk-border bg-tk-surface-hover p-4 ${
        isOver ? 'ring-2 ring-tk-accent ring-offset-2 ring-offset-tk-bg' : ''
      }`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2
          className={`rounded-md px-2 py-1 text-sm font-semibold ${CHART_BADGE_TEXT_CLASSES}`}
          style={{ backgroundColor: hexWithAlpha(statusColor, CHART_BADGE_BG_ALPHA) }}
        >
          {t(`status.${status}`)}
        </h2>
        <span className="rounded-full bg-tk-surface px-2 py-0.5 text-sm font-medium text-tk-text-2 shadow-sm ring-1 ring-tk-border">
          {tasks.length}
        </span>
        {status === 'Todo' && (
          <button
            type="button"
            title={t('a11y.newTask')}
            onClick={onAddTask}
            className="rounded p-0.5 text-tk-text-4 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-2"
            aria-label={t('a11y.newTask')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        )}
      </header>
      {tasks.length === 0 ? (
        <p className="text-sm text-tk-text-3">{t('board.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenTask={onOpenTask}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Column
