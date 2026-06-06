import React from 'react'
import ListView from '../components/List/ListView'
import type { TaskViewProps } from '../types'
import BoardView from './BoardView'

export const TaskView: React.FC<TaskViewProps> = ({
  tasks,
  moveTask,
  onAddTask,
  onOpenTask,
  boardLayout,
  onChangeBoardLayout,
}) => {
  return (
    <div
      id="task-panel"
      role="tabpanel"
      aria-labelledby="nav-task"
      className="flex flex-col"
    >
      <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Task</h2>
          <div
            role="group"
            aria-label="Board layout"
            className="flex rounded-lg bg-slate-100 p-1"
          >
            <button
              type="button"
              aria-label="Board view"
              aria-pressed={boardLayout === 'board'}
              onClick={() => onChangeBoardLayout('board')}
              className={`rounded-md p-1.5 transition-colors ${
                boardLayout === 'board'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={boardLayout === 'list'}
              onClick={() => onChangeBoardLayout('list')}
              className={`rounded-md p-1.5 transition-colors ${
                boardLayout === 'list'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {boardLayout === 'board' ? (
        <BoardView
          tasks={tasks}
          moveTask={moveTask}
          onAddTask={onAddTask}
          onOpenTask={onOpenTask}
        />
      ) : (
        <ListView
          tasks={tasks}
          moveTask={moveTask}
          onAddTask={onAddTask}
          onOpenTask={onOpenTask}
        />
      )}
    </div>
  )
}

export default TaskView
