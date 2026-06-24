import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Task } from '../../types'

type TaskPickerPanelProps = {
  tasks: Task[]
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
  onClose: () => void
}

export const TaskPickerPanel: React.FC<TaskPickerPanelProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onClose,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'Done'),
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activeTasks
    return activeTasks.filter((task) => task.title.toLowerCase().includes(q))
  }, [activeTasks, query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSelect = (id: string | null) => {
    onSelectTask(id)
    onClose()
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/20"
        aria-label={t('a11y.close')}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="focus-picker-title"
        className="absolute left-1/2 top-0 z-50 w-full max-w-sm -translate-x-1/2 rounded-xl border border-tk-border bg-tk-surface p-4 shadow-2xl"
      >
        <h2
          id="focus-picker-title"
          className="mb-3 text-sm font-semibold text-tk-text-1"
        >
          {t('focus.selectTask')}
        </h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('focus.search')}
          aria-label={t('focus.search')}
          className="mb-3 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-tk-accent focus:ring-1 focus:ring-tk-accent dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
        />
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          <li>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-tk-surface-hover ${
                selectedTaskId === null
                  ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'
                  : 'text-tk-text-2'
              }`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full border border-tk-border" />
              {t('focus.noTask')}
            </button>
          </li>
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => handleSelect(task.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-tk-surface-hover ${
                  selectedTaskId === task.id
                    ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'
                    : 'text-tk-text-1'
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-tk-accent" />
                <span className="truncate">{task.title}</span>
              </button>
            </li>
          ))}
          {filteredTasks.length === 0 && query.trim() !== '' && (
            <li className="px-3 py-2 text-sm text-tk-text-3">{t('board.empty')}</li>
          )}
        </ul>
      </div>
    </>
  )
}

export default TaskPickerPanel
