import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import React, { useCallback, useMemo } from 'react'
import type { BoardProps, Status, Task } from '../../types'
import Column from './Column'

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
}) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
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

  const columns = useMemo(
    () =>
      COLUMN_ORDER.map((status) => ({
        status,
        tasks: tasksForStatus(tasks, status),
      })),
    [tasks],
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
        {columns.map(({ status, tasks }) => (
          <Column
            key={status}
            status={status}
            tasks={tasks}
            onMoveTask={moveTask}
            onEditTask={onEditTask}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Board
