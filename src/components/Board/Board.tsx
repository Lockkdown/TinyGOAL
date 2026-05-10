import React, { useCallback, useMemo } from 'react'
import type { Status, Task } from '../../types'
import { useTasks } from '../../hooks/useTasks'
import Column from './Column'

const COLUMN_ORDER: Status[] = ['Todo', 'In Progress', 'Done']

function tasksForStatus(tasks: Task[], status: Status): Task[] {
  return tasks.filter((t) => t.status === status)
}

export const Board: React.FC = () => {
  const { filteredTasks, moveTask, deleteTask } = useTasks()

  const handleEditTask = useCallback(() => {
    // FORM-03: mở modal + setEditingTask
  }, [])

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
          <Column
            key={status}
            status={status}
            tasks={tasks}
            onMoveTask={moveTask}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  )
}

export default Board
