import React from 'react'
import type { HeaderProps } from '../../types'

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onChangeView,
  onAddTask,
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
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
    </header>
  )
}

export default Header
