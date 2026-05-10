import { useDroppable } from '@dnd-kit/core'
import React from 'react'
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
  onMoveTask,
  onEditTask,
  onDeleteTask,
}) => {
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
          {status}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
          {tasks.length}
        </span>
      </header>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có task</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Column
