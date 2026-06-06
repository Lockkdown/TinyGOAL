import React from 'react'
import type { ActiveView, SidebarProps } from '../../types'

const TaskIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const StatisticIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
)

type NavItemProps = {
  view: ActiveView
  label: string
  icon: React.ReactNode
  activeView: ActiveView
  isCollapsed: boolean
  onChangeView: (view: ActiveView) => void
  panelId: string
  navId: string
}

const NavItem: React.FC<NavItemProps> = ({
  view,
  label,
  icon,
  activeView,
  isCollapsed,
  onChangeView,
  panelId,
  navId,
}) => {
  const isActive = activeView === view

  return (
    <button
      type="button"
      role="tab"
      id={navId}
      aria-controls={panelId}
      aria-selected={isActive}
      onClick={() => onChangeView(view)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      {icon}
      <span className={isCollapsed ? 'sr-only' : ''}>{label}</span>
    </button>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  isCollapsed,
  onToggleCollapsed,
}) => {
  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-56'
      }`}
    >
      <div
        className={`flex items-center border-b border-slate-200 p-3 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && <h1 className="text-lg font-bold text-slate-900">TinyGOAL</h1>}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-5 w-5 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <nav role="tablist" aria-label="Switch view" className="flex flex-col gap-1 p-2">
        <NavItem
          view="task"
          label="Task"
          icon={<TaskIcon />}
          activeView={activeView}
          isCollapsed={isCollapsed}
          onChangeView={onChangeView}
          navId="nav-task"
          panelId="task-panel"
        />
        <NavItem
          view="statistic"
          label="Statistic"
          icon={<StatisticIcon />}
          activeView={activeView}
          isCollapsed={isCollapsed}
          onChangeView={onChangeView}
          navId="nav-statistic"
          panelId="statistic-panel"
        />
      </nav>
    </aside>
  )
}

export default Sidebar
