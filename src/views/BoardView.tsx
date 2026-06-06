import React from 'react'
import Board from '../components/Board/Board'
import type { BoardViewProps } from '../types'

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  moveTask,
  deleteTask,
  onEditTask,
}) => {
  return (
    <div
      id="board-panel"
      role="tabpanel"
      aria-labelledby="tab-board"
      className="mx-auto w-full max-w-6xl px-4 pt-6 pb-8"
    >
      <Board
        tasks={tasks}
        moveTask={moveTask}
        deleteTask={deleteTask}
        onEditTask={onEditTask}
      />
    </div>
  )
}

export default BoardView
