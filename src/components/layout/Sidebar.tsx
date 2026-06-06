import React from 'react'
import { useTranslation } from 'react-i18next'
import { setLanguage, type AppLanguage } from '../../i18n'
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

type LanguageSwitchProps = {
  isCollapsed: boolean
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ isCollapsed }) => {
  const { t, i18n } = useTranslation()
  const current = i18n.language.startsWith('vi') ? 'vi' : 'en'

  const handleChange = (lng: AppLanguage) => {
    if (lng !== current) setLanguage(lng)
  }

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => handleChange(current === 'vi' ? 'en' : 'vi')}
        aria-label={current === 'vi' ? t('lang.switchToEn') : t('lang.switchToVi')}
        className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        {current === 'vi' ? t('lang.en') : t('lang.vi')}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label={current === 'vi' ? t('lang.switchToVi') : t('lang.switchToEn')}
      className="flex rounded-md border border-slate-200 p-0.5 text-xs"
    >
      <button
        type="button"
        onClick={() => handleChange('vi')}
        aria-pressed={current === 'vi'}
        aria-label={t('lang.switchToVi')}
        className={`rounded px-2 py-1 font-semibold transition-colors ${
          current === 'vi'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t('lang.vi')}
      </button>
      <button
        type="button"
        onClick={() => handleChange('en')}
        aria-pressed={current === 'en'}
        aria-label={t('lang.switchToEn')}
        className={`rounded px-2 py-1 font-semibold transition-colors ${
          current === 'en'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  isCollapsed,
  onToggleCollapsed,
}) => {
  const { t } = useTranslation()

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
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-slate-900">{t('app.name')}</h1>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={
            isCollapsed ? t('a11y.expandSidebar') : t('a11y.collapseSidebar')
          }
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
      <div className={`mt-auto border-t border-slate-200 p-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <LanguageSwitch isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

export default Sidebar
