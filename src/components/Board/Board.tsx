import React, { useMemo } from 'react'
import type { Status, Task } from '../../types'
import { useTasks } from '../../hooks/useTasks'

const COLUMN_ORDER: Status[] = ['Todo', 'In Progress', 'Done']

function tasksForStatus(tasks: Task[], status: Status): Task[] {
  return tasks.filter((t) => t.status === status)
}

export const Board: React.FC = () => {
  const { filteredTasks } = useTasks()

  const columns = useMemo(
    () =>
      COLUMN_ORDER.map((status) => ({
        status,
        tasks: tasksForStatus(filteredTasks, status),
      })),
    [filteredTasks],
  )

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
        {columns.map(({ status, tasks }) => (
          <section
            key={status}
            className="flex min-h-[200px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <header className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-800">{status}</h2>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-sm font-medium text-slate-700">
                {tasks.length}
              </span>
            </header>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có task</p>
            ) : (
              <ul className="list-none space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export default Board
