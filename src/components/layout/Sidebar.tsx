import React from 'react'
import { useTranslation } from 'react-i18next'
import type { ActiveView, SidebarProps } from '../../types'
import { GearIcon } from '../shared/icons'

const SIDEBAR_ACTIVE_CLASSES =
  'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'

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
          ? SIDEBAR_ACTIVE_CLASSES
          : 'text-tk-text-2 hover:bg-tk-surface-hover hover:text-tk-text-1'
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
  onOpenSettings,
}) => {
  const { t } = useTranslation()

  return (
    <aside
      className={`sticky top-0 z-[60] flex h-screen shrink-0 flex-col border-r border-tk-border bg-tk-surface transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-56'
      }`}
    >
      <div
        className={`flex items-center border-b border-tk-border p-3 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-tk-text-1">{t('app.name')}</h1>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={
            isCollapsed ? t('a11y.expandSidebar') : t('a11y.collapseSidebar')
          }
          className="rounded-md p-1.5 text-tk-text-3 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1"
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
      <nav
        role="tablist"
        aria-label={t('nav.switchView')}
        className="flex flex-col gap-1 p-2"
      >
        <NavItem
          view="task"
          label={t('nav.task')}
          icon={<TaskIcon />}
          activeView={activeView}
          isCollapsed={isCollapsed}
          onChangeView={onChangeView}
          navId="nav-task"
          panelId="task-panel"
        />
        <NavItem
          view="statistic"
          label={t('nav.statistic')}
          icon={<StatisticIcon />}
          activeView={activeView}
          isCollapsed={isCollapsed}
          onChangeView={onChangeView}
          navId="nav-statistic"
          panelId="statistic-panel"
        />
      </nav>
      <div
        className={`mt-auto border-t border-tk-border p-2 ${
          isCollapsed ? 'flex justify-center' : ''
        }`}
      >
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t('settings.open')}
          title={t('settings.title')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-tk-text-2 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <GearIcon />
          <span className={isCollapsed ? 'sr-only' : ''}>{t('settings.title')}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
