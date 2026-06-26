import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import type { Category, Priority, Status, Task } from '../../types'
import { getCategoryChartColor, getPriorityPillColor, getStatusChartColor } from '../../utils/chartColors'
import { todayDateKey } from '../../utils/helpers'
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '../shared/fieldOptions'
import { StatusIcon } from '../shared/icons'
import { PriorityIcon } from '../shared/PriorityIcon'
import { ModalPortal } from '../shared/ModalPortal'
import { SegmentedField } from '../shared/SegmentedField'

const TEXT_INPUT_CLASS =
  'w-full border-0 bg-transparent outline-none focus:ring-0 text-neutral-900 placeholder:text-neutral-500 dark:text-neutral-100 dark:placeholder:text-neutral-500'

const PILL_FIELD_CLASS =
  'rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-900 focus:border-tk-accent focus:outline-none focus:ring-1 focus:ring-tk-accent dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'

export type QuickAddTaskProps = {
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onClose: () => void
  initialDeadline?: string
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onSubmit,
  onClose,
  initialDeadline,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [entered, setEntered] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Status>('Todo')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [category, setCategory] = useState<Category>('Other')
  const [deadline, setDeadline] = useState(initialDeadline ?? todayDateKey())

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
          aria-labelledby="quick-add-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-tk-surface shadow-2xl transition-opacity duration-200 ease-out motion-reduce:transition-none [color-scheme:light] dark:[color-scheme:dark] ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
        >
        <div className="flex items-center justify-between border-b border-tk-border px-4 py-3">
          <h2 id="quick-add-title" className="text-sm font-semibold text-tk-text-1">
            {t('form.newTask')}
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

        <div className="flex flex-col gap-4 p-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('form.titlePlaceholder')}
            autoFocus
            className={`${TEXT_INPUT_CLASS} text-2xl font-semibold`}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t('form.descriptionPlaceholder')}
            className={`${TEXT_INPUT_CLASS} resize-none text-sm leading-relaxed`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <SegmentedField
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
              getLabel={(s) => t(`status.${s}`)}
              ariaLabel={t('a11y.status')}
              getColor={(s) => getStatusChartColor(s, theme)}
              renderIcon={(s) => <StatusIcon status={s} />}
            />

            <SegmentedField
              value={priority}
              options={PRIORITY_OPTIONS}
              onChange={setPriority}
              getLabel={(p) => t(`priority.${p}`)}
              ariaLabel={t('a11y.priority')}
              getColor={(p) => getPriorityPillColor(p, theme)}
              renderIcon={(p) => <PriorityIcon priority={p} />}
            />

            <SegmentedField
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
              getLabel={(c) => t(`category.${c}`)}
              ariaLabel={t('a11y.category')}
              getColor={(c) => getCategoryChartColor(c, theme)}
            />

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-label={t('a11y.deadline')}
              className={PILL_FIELD_CLASS}
            />
          </div>

          <div className="flex justify-end border-t border-tk-border-subtle pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isTitleEmpty}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-600 dark:hover:bg-neutral-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('form.createTask')}
            </button>
          </div>
        </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default QuickAddTask
