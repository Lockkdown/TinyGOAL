import React, { useEffect, useState } from 'react'
import CategoryBadge from '../shared/CategoryBadge'
import PriorityIcon from '../shared/PriorityIcon'
import TaskForm from '../TaskForm/TaskForm'
import type { Status, TaskDetailPanelProps } from '../../types'
import { formatDeadline, isOverdue } from '../../utils/helpers'

const STATUS_CLASSES: Record<Status, string> = {
  Todo: 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-600',
  Done: 'bg-green-100 text-green-600',
}

const OVERDUE_CLASS = 'text-red-500 font-medium'

type TaskDetailPanelContentProps = Omit<TaskDetailPanelProps, 'task'> & {
  task: NonNullable<TaskDetailPanelProps['task']>
}

const TaskDetailPanelContent: React.FC<TaskDetailPanelContentProps> = ({
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
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

  const overdue = isOverdue(task)
  const deadlineClasses = overdue ? OVERDUE_CLASS : 'text-slate-600'

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
          <h2
            id="detail-title"
            className="min-w-0 flex-1 break-words text-xl font-semibold text-slate-900"
          >
            {task.title}
          </h2>
          {mode === 'view' && (
            <>
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(task.id)
                  onClose()
                }}
                aria-label="Delete task"
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
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {mode === 'view' ? (
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {task.description.trim() ? (
                task.description
              ) : (
                <span className="text-slate-400">No description</span>
              )}
            </p>

            <hr className="border-slate-100" />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <CategoryBadge category={task.category} />
              <div className="flex items-center gap-2">
                <PriorityIcon priority={task.priority} />
                <span className="text-slate-700">{task.priority}</span>
              </div>
              <span
                className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[task.status]}`}
              >
                {task.status}
              </span>
              <span className={deadlineClasses}>
                {formatDeadline(task.deadline)}
                {overdue ? ' (Overdue)' : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <TaskForm
              key={task.id}
              initialData={task}
              onSubmit={(data) => {
                onSave(task.id, data)
                setMode('view')
              }}
              onCancel={() => setMode('view')}
            />
          </div>
        )}
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
