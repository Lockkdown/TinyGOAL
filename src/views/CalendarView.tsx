import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalPortal } from '../components/shared/ModalPortal'
import { useTheme } from '../hooks/useTheme'
import type { CalendarViewProps, Task } from '../types'
import { getCategoryChartColor, hexWithAlpha } from '../utils/chartColors'
import { formatDeadline, getCalendarMatrix, groupTasksByDeadline } from '../utils/helpers'

const MAX_PILLS_PER_CELL = 3

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

type CalendarDayPanelProps = {
  dateKey: string
  tasks: Task[]
  onClose: () => void
  onOpenTask: (task: Task) => void
  onAddTaskOnDate: (dateKey: string) => void
}

const CalendarDayPanel: React.FC<CalendarDayPanelProps> = ({
  dateKey,
  tasks,
  onClose,
  onOpenTask,
  onAddTaskOnDate,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const formattedDate = formatDeadline(dateKey)

  return (
    <ModalPortal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-day-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex max-h-[min(24rem,80vh)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-tk-surface shadow-2xl transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between border-b border-tk-border px-4 py-3">
            <h2 id="calendar-day-title" className="text-sm font-semibold text-tk-text-1">
              {t('calendar.dayTasksTitle', { date: formattedDate })}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('a11y.close')}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
            {tasks.map((task) => {
              const color = getCategoryChartColor(task.category, theme)
              const isDone = task.status === 'Done'
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenTask(task)
                      onClose()
                    }}
                    style={{
                      backgroundColor: hexWithAlpha(color, 0.18),
                      borderLeft: `3px solid ${color}`,
                    }}
                    className={`block w-full rounded px-3 py-2 text-left text-sm text-tk-text-1 transition-colors hover:brightness-95 dark:hover:brightness-110 motion-reduce:transition-none ${
                      isDone ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {task.title}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-tk-border-subtle p-4">
            <button
              type="button"
              onClick={() => {
                onAddTaskOnDate(dateKey)
                onClose()
              }}
              className="w-full rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-600 dark:hover:bg-neutral-500 motion-reduce:transition-none"
            >
              {t('calendar.addTaskButton')}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

type CalendarCellProps = {
  cellKey: string
  day: number
  inMonth: boolean
  isToday: boolean
  tasks: Task[]
  onOpenTask: (task: Task) => void
  onAddTaskOnDate: (dateKey: string) => void
  onShowDayTasks: (dateKey: string) => void
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  cellKey,
  day,
  inMonth,
  isToday,
  tasks,
  onOpenTask,
  onAddTaskOnDate,
  onShowDayTasks,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const visibleCount =
    tasks.length > MAX_PILLS_PER_CELL ? MAX_PILLS_PER_CELL - 1 : tasks.length
  const visible = tasks.slice(0, visibleCount)
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
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex flex-col gap-1">
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
                  className={`block w-full shrink-0 truncate rounded px-1.5 py-1 text-left text-xs leading-normal text-tk-text-1 ${
                    isDone ? 'line-through opacity-60' : ''
                  }`}
                  title={task.title}
                >
                  {task.title}
                </button>
              )
            })}
          </div>
        </div>
        {overflow > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onShowDayTasks(cellKey)
            }}
            className="mt-1 shrink-0 truncate text-left text-xs leading-normal text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
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
  const [dayPanelDate, setDayPanelDate] = useState<string | null>(null)

  const weeks = useMemo(
    () => getCalendarMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  )
  const byDate = useMemo(() => groupTasksByDeadline(tasks), [tasks])

  const dayPanelTasks = useMemo(
    () => (dayPanelDate ? (byDate.get(dayPanelDate) ?? []) : []),
    [dayPanelDate, byDate],
  )

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
              onShowDayTasks={setDayPanelDate}
            />
          ))}
        </div>
      </div>
      {dayPanelDate && (
        <CalendarDayPanel
          dateKey={dayPanelDate}
          tasks={dayPanelTasks}
          onClose={() => setDayPanelDate(null)}
          onOpenTask={onOpenTask}
          onAddTaskOnDate={onAddTaskOnDate}
        />
      )}
    </div>
  )
}

export default CalendarView
