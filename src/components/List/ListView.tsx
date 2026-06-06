import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import React, { useCallback } from 'react'
import type { ListViewProps, Status, Task } from '../../types'
import TaskListItem from './TaskListItem'

const STATUSES: Status[] = ['Todo', 'In Progress', 'Done']

const STATUS_HEADER_CLASSES: Record<Status, string> = {
  Todo: 'bg-slate-200 text-slate-700',
  'In Progress': 'bg-amber-100 text-amber-800',
  Done: 'bg-green-100 text-green-800',
}

const STATUS_COUNT_CLASSES: Record<Status, string> = {
  Todo: 'text-slate-500',
  'In Progress': 'text-amber-600/70',
  Done: 'text-green-600/70',
}

function isStatus(id: string): id is Status {
  return (STATUSES as readonly string[]).includes(id)
}

type StatusIconProps = {
  status: Status
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === 'Todo') {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  if (status === 'In Progress') {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 2 A6 6 0 0 1 14 8 L8 8 Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8 L7 9.5 L10.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ListGroupProps = {
  status: Status
  items: Task[]
}

const ListGroup: React.FC<ListGroupProps> = ({ status, items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      className={isOver ? 'rounded-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-100' : ''}
    >
      <header
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 ${STATUS_HEADER_CLASSES[status]}`}
      >
        <StatusIcon status={status} />
        <h2 className="text-sm font-semibold">{status}</h2>
        <span className={`text-sm font-medium tabular-nums ${STATUS_COUNT_CLASSES[status]}`}>
          {items.length}
        </span>
      </header>
      <div className="mt-2">
        {items.length === 0 ? (
          <p className="px-1 py-2 text-sm text-slate-500">Chưa có task</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((task) => (
              <TaskListItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export const ListView: React.FC<ListViewProps> = ({ tasks, moveTask }) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return
      const taskId = String(active.id)
      const overId = String(over.id)
      if (!isStatus(overId)) return
      const task = tasks.find((t) => t.id === taskId)
      if (!task || task.status === overId) return
      moveTask(taskId, overId)
    },
    [tasks, moveTask],
  )

  const tasksByStatus = STATUSES.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  }))

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        id="board-panel"
        role="tabpanel"
        aria-labelledby="tab-board"
        className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-6 pb-8"
      >
        {tasksByStatus.map(({ status, items }) => (
          <ListGroup key={status} status={status} items={items} />
        ))}
      </div>
    </DndContext>
  )
}

export default ListView
