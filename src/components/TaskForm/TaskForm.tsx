import React, { useState } from 'react'
import type { Category, Priority, TaskFormProps } from '../../types'
import { todayDateKey } from '../../utils/helpers'

const CATEGORIES: Category[] = ['Work', 'Personal', 'Study', 'Other']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(() => initialData?.title ?? '')
  const [description, setDescription] = useState(() => initialData?.description ?? '')
  const [category, setCategory] = useState<Category>(() => initialData?.category ?? 'Other')
  const [priority, setPriority] = useState<Priority>(() => initialData?.priority ?? 'Medium')
  const [deadline, setDeadline] = useState(() => initialData?.deadline ?? todayDateKey())
  const [titleError, setTitleError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setTitleError(true)
      return
    }
    setTitleError(false)
    onSubmit({
      title: trimmed,
      description: description.trim(),
      category,
      priority,
      status: initialData?.status ?? 'Todo',
      deadline,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError(false)
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {titleError ? (
          <p className="mt-1 text-xs text-red-600">Title is required.</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="task-desc" className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="task-category" className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="task-deadline" className="mb-1 block text-sm font-medium text-slate-700">
          Deadline
        </label>
        <input
          id="task-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="mt-2 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {initialData ? 'Save' : 'Add task'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
