import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category, Priority, Status, Task } from '../../types'
import { todayDateKey } from '../../utils/helpers'

const STATUSES: Status[] = ['Todo', 'In Progress', 'Done']
const CATEGORIES: Category[] = ['Work', 'Personal', 'Study', 'Other']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

export type QuickAddTaskProps = {
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({ onSubmit, onClose }) => {
  const { t } = useTranslation()
  const [entered, setEntered] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Status>('Todo')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [category, setCategory] = useState<Category>('Other')
  const [deadline, setDeadline] = useState(todayDateKey())

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

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit({
      title: trimmed,
      description: description.trim(),
      status,
      priority,
      category,
      deadline,
    })
  }

  const isTitleEmpty = !title.trim()

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
        aria-labelledby="quick-add-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full max-w-lg transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ease-out motion-reduce:transition-none ${
          entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="quick-add-title" className="text-sm font-semibold text-slate-900">
            {t('form.newTask')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('a11y.close')}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('form.titlePlaceholder')}
            autoFocus
            className="w-full border-0 bg-transparent text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300 focus:ring-0"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t('form.descriptionPlaceholder')}
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              aria-label={t('a11y.status')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              aria-label={t('a11y.priority')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`priority.${p}`)}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              aria-label={t('a11y.category')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`category.${c}`)}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-label={t('a11y.deadline')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isTitleEmpty}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('form.createTask')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickAddTask
