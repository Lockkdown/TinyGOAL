import React, { useMemo } from 'react'
import type { BoardProps, Status, Task } from '../../types'
import Column from './Column'

const COLUMN_ORDER: Status[] = ['Todo', 'In Progress', 'Done']

function tasksForStatus(tasks: Task[], status: Status): Task[] {
  return tasks.filter((t) => t.status === status)
}

export const Board: React.FC<BoardProps> = ({
  filteredTasks,
  moveTask,
  deleteTask,
  onEditTask,
}) => {
  const columns = useMemo(
    () =>
      COLUMN_ORDER.map((status) => ({
        status,
        tasks: tasksForStatus(filteredTasks, status),
      })),
    [filteredTasks],
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
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
    </div>
  )
}

export default Board
