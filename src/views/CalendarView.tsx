import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import type { CalendarViewProps, Task } from '../types'
import { getCategoryChartColor, hexWithAlpha } from '../utils/chartColors'
import { getCalendarMatrix, groupTasksByDeadline } from '../utils/helpers'

const MAX_PILLS_PER_CELL = 3

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

type CalendarCellProps = {
  cellKey: string
  day: number
  inMonth: boolean
  isToday: boolean
  tasks: Task[]
  onOpenTask: (task: Task) => void
  onAddTaskOnDate: (dateKey: string) => void
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  cellKey,
  day,
  inMonth,
  isToday,
  tasks,
  onOpenTask,
  onAddTaskOnDate,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const visible = tasks.slice(0, MAX_PILLS_PER_CELL)
  const overflow = tasks.length - visible.length

  return (
    <div
      className={`flex h-full min-h-0 flex-col border border-tk-border p-1.5 sm:p-2 ${
        inMonth
          ? 'bg-white dark:bg-tk-surface'
          : 'bg-neutral-100 dark:bg-neutral-900/50'
      }`}
    >
      <button
        type="button"
        onClick={() => onAddTaskOnDate(cellKey)}
        aria-label={t('calendar.addTaskOnDate', { date: cellKey })}
        className="mb-1.5 flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-sm font-medium transition-colors hover:bg-tk-surface-hover motion-reduce:transition-none"
      >
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
            isToday
              ? 'bg-tk-accent text-white'
              : inMonth
                ? 'text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {day}
        </span>
      </button>
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
        {visible.map((task) => {
          const color = getCategoryChartColor(task.category, theme)
          const isDone = task.status === 'Done'
          return (
            <button
              key={task.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenTask(task)
              }}
              style={{
                backgroundColor: hexWithAlpha(color, 0.18),
                borderLeft: `3px solid ${color}`,
              }}
              className={`block w-full truncate rounded px-1.5 py-1 text-left text-xs text-tk-text-1 sm:text-sm ${
                isDone ? 'line-through opacity-60' : ''
              }`}
              title={task.title}
            >
              {task.title}
            </button>
          )
        })}
        {overflow > 0 && (
          <button
            type="button"
            onClick={() => onAddTaskOnDate(cellKey)}
            className="truncate text-left text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {t('calendar.more', { n: overflow })}
          </button>
        )}
      </div>
    </div>
  )
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onOpenTask,
  onAddTaskOnDate,
}) => {
  const { t } = useTranslation()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const weeks = useMemo(
    () => getCalendarMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  )
  const byDate = useMemo(() => groupTasksByDeadline(tasks), [tasks])

  const monthTitle = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
        new Date(viewYear, viewMonth, 1),
      ),
    [viewYear, viewMonth],
  )

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const goToday = () => {
    const d = new Date()
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const cells = useMemo(() => weeks.flat(), [weeks])

  return (
    <div
      id="calendar-panel"
      role="tabpanel"
      aria-labelledby="nav-calendar"
      className="flex h-[calc(100vh)] w-full flex-col px-4 pb-4 pt-4 sm:px-6"
    >
      <header className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label={t('calendar.prevMonth')}
            className="rounded-md px-2.5 py-1 text-xl text-tk-text-2 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1 motion-reduce:transition-none"
          >
            ‹
          </button>
          <h2 className="min-w-[12rem] text-center text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
            {monthTitle}
          </h2>
          <button
            type="button"
            onClick={goNext}
            aria-label={t('calendar.nextMonth')}
            className="rounded-md px-2.5 py-1 text-xl text-tk-text-2 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1 motion-reduce:transition-none"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="rounded-lg border border-tk-border bg-tk-surface px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-tk-surface-hover dark:text-neutral-100 motion-reduce:transition-none"
        >
          {t('calendar.today')}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-tk-border">
        <div className="grid shrink-0 grid-cols-7 border-b-2 border-neutral-400 bg-neutral-300 dark:border-neutral-600 dark:bg-neutral-800">
          {WEEKDAY_KEYS.map((key) => (
            <div
              key={key}
              className="px-1 py-2.5 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {t(`calendar.weekdays.${key}`)}
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 bg-neutral-100 dark:bg-neutral-950">
          {cells.map((cell) => (
            <CalendarCell
              key={cell.key}
              cellKey={cell.key}
              day={cell.day}
              inMonth={cell.inMonth}
              isToday={cell.isToday}
              tasks={byDate.get(cell.key) ?? []}
              onOpenTask={onOpenTask}
              onAddTaskOnDate={onAddTaskOnDate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarView
