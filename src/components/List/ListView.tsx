import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import type { ListViewProps, Status, Task } from '../../types'
import {
  CHART_BADGE_BG_ALPHA,
  CHART_BADGE_TEXT_CLASSES,
  getStatusChartColor,
  hexWithAlpha,
} from '../../utils/chartColors'
import TaskListItem from './TaskListItem'

const STATUSES: Status[] = ['Todo', 'In Progress', 'Done']

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
  onAddTask?: () => void
  onOpenTask: (task: Task) => void
}

const ListGroup: React.FC<ListGroupProps> = ({ status, items, onAddTask, onOpenTask }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const statusColor = getStatusChartColor(status, theme)

  return (
    <section
      ref={setNodeRef}
      className={isOver ? 'rounded-lg ring-2 ring-tk-accent ring-offset-2 ring-offset-tk-bg' : ''}
    >
      <header
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 ${CHART_BADGE_TEXT_CLASSES}`}
        style={{ backgroundColor: hexWithAlpha(statusColor, CHART_BADGE_BG_ALPHA) }}
      >
        <StatusIcon status={status} />
        <h2 className="text-sm font-semibold">{t(`status.${status}`)}</h2>
        <span className="text-sm font-medium tabular-nums opacity-80">
          {items.length}
        </span>
        {onAddTask && (
          <button
            type="button"
            title={t('a11y.newTask')}
            onClick={onAddTask}
            aria-label={t('a11y.newTask')}
            className="ml-auto rounded-md bg-tk-surface p-1 text-tk-text-2 shadow-sm ring-1 ring-tk-border transition-colors hover:bg-neutral-300 hover:text-tk-text-1 hover:ring-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 dark:hover:ring-neutral-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        )}
      </header>
      <div className="mt-2">
        {items.length === 0 ? (
          <p className="px-1 py-2 text-sm text-tk-text-3">{t('board.empty')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((task) => (
              <TaskListItem key={task.id} task={task} onOpenTask={onOpenTask} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export const ListView: React.FC<ListViewProps> = ({ tasks, moveTask, onAddTask, onOpenTask }) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeWidth, setActiveWidth] = useState<number | null>(null)

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id)
      if (!task) return
      setActiveTask(task)
      const width = event.active.rect.current.initial?.width
      if (width) setActiveWidth(width)
    },
    [tasks],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTask(null)
      setActiveWidth(null)
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

  const handleDragCancel = useCallback(() => {
    setActiveTask(null)
    setActiveWidth(null)
  }, [])

  const tasksByStatus = STATUSES.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  }))

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-6 pb-8">
        {tasksByStatus.map(({ status, items }) => (
          <ListGroup
            key={status}
            status={status}
            items={items}
            onAddTask={status === 'Todo' ? onAddTask : undefined}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div style={{ width: activeWidth ?? undefined }}>
            <TaskListItem task={activeTask} onOpenTask={() => {}} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default ListView
