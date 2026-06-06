import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnProps, Status } from '../../types'
import TaskCard from './TaskCard'

const STATUS_CLASSES: Record<Status, string> = {
  Todo: 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-600',
  Done: 'bg-green-100 text-green-600',
}

export const Column: React.FC<ColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onOpenTask,
}) => {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[200px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-4 ${
        isOver ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-100' : ''
      }`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2
          className={`rounded-md px-2 py-1 text-sm font-semibold ${STATUS_CLASSES[status]}`}
        >
          {t(`status.${status}`)}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
          {tasks.length}
        </span>
        {status === 'Todo' && (
          <button
            type="button"
            title={t('a11y.newTask')}
            onClick={onAddTask}
            className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
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
        <p className="text-sm text-slate-500">{t('board.empty')}</p>
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
