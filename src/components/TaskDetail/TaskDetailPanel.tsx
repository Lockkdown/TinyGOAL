import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category, Priority, Status, TaskDetailPanelProps } from '../../types'

const STATUSES: Status[] = ['Todo', 'In Progress', 'Done']
const CATEGORIES: Category[] = ['Work', 'Personal', 'Study', 'Other']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

type TaskDetailPanelContentProps = Omit<TaskDetailPanelProps, 'task'> & {
  task: NonNullable<TaskDetailPanelProps['task']>
}

const TaskDetailPanelContent: React.FC<TaskDetailPanelContentProps> = ({
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation()
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
        className={`flex max-h-[85vh] w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ease-out motion-reduce:transition-none ${
          entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <input
            id="detail-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="min-w-0 flex-1 border-0 bg-transparent text-xl font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
            placeholder={t('form.taskTitlePlaceholder')}
          />
          <button
            type="button"
            onClick={() => {
              onDelete(task.id)
              onClose()
            }}
            aria-label={t('a11y.deleteTask')}
            className="shrink-0 rounded p-1.5 text-red-500 hover:bg-red-50"
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
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
          />

          <hr className="border-slate-100" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="detail-status" className="shrink-0 text-sm font-medium text-slate-600">
                {t('detail.status')}
              </label>
              <select
                id="detail-status"
                value={task.status}
                onChange={(e) => onSave(task.id, { status: e.target.value as Status })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`status.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="detail-priority"
                className="shrink-0 text-sm font-medium text-slate-600"
              >
                {t('detail.priority')}
              </label>
              <select
                id="detail-priority"
                value={task.priority}
                onChange={(e) => onSave(task.id, { priority: e.target.value as Priority })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {t(`priority.${p}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="detail-category"
                className="shrink-0 text-sm font-medium text-slate-600"
              >
                {t('detail.category')}
              </label>
              <select
                id="detail-category"
                value={task.category}
                onChange={(e) => onSave(task.id, { category: e.target.value as Category })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`category.${c}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="detail-deadline"
                className="shrink-0 text-sm font-medium text-slate-600"
              >
                {t('detail.deadline')}
              </label>
              <input
                id="detail-deadline"
                type="date"
                value={task.deadline}
                onChange={(e) => onSave(task.id, { deadline: e.target.value })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
