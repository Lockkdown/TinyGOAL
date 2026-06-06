import React from 'react'
import Board from '../components/Board/Board'
import type { BoardViewProps } from '../types'

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  moveTask,
  onAddTask,
  onOpenTask,
}) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-8">
      <Board
        tasks={tasks}
        moveTask={moveTask}
        onAddTask={onAddTask}
        onOpenTask={onOpenTask}
      />
    </div>
  )
}

export default BoardView
