import React from 'react'
import type { HeaderProps } from '../../types'

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onChangeView,
  onAddTask,
  boardLayout,
  onChangeBoardLayout,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900">TinyGOAL</h1>
          <div
            role="tablist"
            aria-label="Switch view"
            className="flex rounded-lg bg-slate-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'board'}
              id="tab-board"
              aria-controls="board-panel"
              onClick={() => onChangeView('board')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === 'board'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Board
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'dashboard'}
              id="tab-dashboard"
              aria-controls="dashboard-panel"
              onClick={() => onChangeView('dashboard')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeView === 'board' && (
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
          )}
          <button
            type="button"
            onClick={onAddTask}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
