import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import React, { useCallback, useMemo, useState } from 'react'
import type { BoardProps, Status, Task } from '../../types'
import Column from './Column'
import TaskCard from './TaskCard'

const COLUMN_ORDER: Status[] = ['Todo', 'In Progress', 'Done']

function isColumnStatus(id: string): id is Status {
  return (COLUMN_ORDER as readonly string[]).includes(id)
}

function tasksForStatus(tasks: Task[], status: Status): Task[] {
  return tasks.filter((t) => t.status === status)
}

export const Board: React.FC<BoardProps> = ({
  tasks,
  moveTask,
  deleteTask,
  onEditTask,
  onAddTask,
}) => {
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
      if (!isColumnStatus(overId)) return
      const targetStatus = overId
      const task = tasks.find((t) => t.id === taskId)
      if (!task || task.status === targetStatus) return
      moveTask(taskId, targetStatus)
    },
    [tasks, moveTask],
  )

  const handleDragCancel = useCallback(() => {
    setActiveTask(null)
    setActiveWidth(null)
  }, [])

  const columns = useMemo(
    () =>
      COLUMN_ORDER.map((status) => ({
        status,
        tasks: tasksForStatus(tasks, status),
      })),
    [tasks],
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
        {columns.map(({ status, tasks }) => (
          <Column
            key={status}
            status={status}
            tasks={tasks}
            onMoveTask={moveTask}
            onEditTask={onEditTask}
            onDeleteTask={deleteTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div style={{ width: activeWidth ?? undefined }}>
            <TaskCard
              task={activeTask}
              onEdit={onEditTask}
              onDelete={deleteTask}
              onMove={moveTask}
              isOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
