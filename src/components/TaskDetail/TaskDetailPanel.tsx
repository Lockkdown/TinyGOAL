import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import type { TaskDetailPanelProps } from '../../types'
import {
  getCategoryChartColor,
  getPriorityPillColor,
  getStatusChartColor,
} from '../../utils/chartColors'
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '../shared/fieldOptions'
import { StatusIcon } from '../shared/icons'
import { PriorityIcon } from '../shared/PriorityIcon'
import { ModalPortal } from '../shared/ModalPortal'
import { SegmentedField } from '../shared/SegmentedField'

type TaskDetailPanelContentProps = Omit<TaskDetailPanelProps, 'task'> & {
  task: NonNullable<TaskDetailPanelProps['task']>
}

const TEXT_INPUT_CLASS =
  'border-0 bg-transparent outline-none focus:ring-0 text-neutral-900 placeholder:text-neutral-500 dark:text-neutral-100 dark:placeholder:text-neutral-500'

const SELECT_CLASS =
  'rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-900 focus:border-tk-accent focus:outline-none focus:ring-1 focus:ring-tk-accent dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'

const TaskDetailPanelContent: React.FC<TaskDetailPanelContentProps> = ({
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [entered, setEntered] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

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

  const handleTitleBlur = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      setTitle(task.title)
      return
    }
    if (trimmed !== task.title) {
      onSave(task.id, { title: trimmed })
      setTitle(trimmed)
    }
  }

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      onSave(task.id, { description })
    }
  }

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
          aria-labelledby="detail-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-tk-surface shadow-2xl transition-opacity duration-200 ease-out motion-reduce:transition-none [color-scheme:light] dark:[color-scheme:dark] ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
        >
        <div className="flex items-center gap-2 border-b border-tk-border px-4 py-3">
          <input
            id="detail-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className={`min-w-0 flex-1 text-xl font-semibold ${TEXT_INPUT_CLASS}`}
            placeholder={t('form.taskTitlePlaceholder')}
          />
          <button
            type="button"
            onClick={() => {
              onDelete(task.id)
              onClose()
            }}
            aria-label={t('a11y.deleteTask')}
            className="shrink-0 rounded p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('a11y.close')}
            className="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            rows={4}
            placeholder={t('form.descriptionPlaceholder')}
            className={`w-full resize-none text-sm leading-relaxed ${TEXT_INPUT_CLASS}`}
          />

          <hr className="border-tk-border-subtle" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-300">
                {t('detail.status')}
              </span>
              <SegmentedField
                value={task.status}
                options={STATUS_OPTIONS}
                onChange={(v) => onSave(task.id, { status: v })}
                getLabel={(s) => t(`status.${s}`)}
                ariaLabel={t('a11y.status')}
                getColor={(s) => getStatusChartColor(s, theme)}
                renderIcon={(s) => <StatusIcon status={s} />}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-300">
                {t('detail.priority')}
              </span>
              <SegmentedField
                value={task.priority}
                options={PRIORITY_OPTIONS}
                onChange={(v) => onSave(task.id, { priority: v })}
                getLabel={(p) => t(`priority.${p}`)}
                ariaLabel={t('a11y.priority')}
                getColor={(p) => getPriorityPillColor(p, theme)}
                renderIcon={(p) => <PriorityIcon priority={p} />}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-300">
                {t('detail.category')}
              </span>
              <SegmentedField
                value={task.category}
                options={CATEGORY_OPTIONS}
                onChange={(v) => onSave(task.id, { category: v })}
                getLabel={(c) => t(`category.${c}`)}
                ariaLabel={t('a11y.category')}
                getColor={(c) => getCategoryChartColor(c, theme)}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="detail-deadline"
                className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-300"
              >
                {t('detail.deadline')}
              </label>
              <input
                id="detail-deadline"
                type="date"
                value={task.deadline}
                onChange={(e) => onSave(task.id, { deadline: e.target.value })}
                className={SELECT_CLASS}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-300">
                {t('detail.pomodoroCount')}
              </span>
              <span className="text-sm tabular-nums text-neutral-900 dark:text-neutral-100">
                {task.pomodoroCount ?? 0}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!task) return null

  return (
    <TaskDetailPanelContent
      key={task.id}
      task={task}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  )
}

export default TaskDetailPanel
