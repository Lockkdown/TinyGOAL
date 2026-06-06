import React from 'react'
import { useTranslation } from 'react-i18next'
import { setLanguage, type AppLanguage } from '../../i18n'
import type { ActiveView, AppTheme, SidebarProps } from '../../types'

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

const SunIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
  </svg>
)

const MoonIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
      clipRule="evenodd"
    />
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
        className="rounded-md px-2 py-1 text-xs font-semibold text-tk-text-2 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1"
      >
        {current === 'vi' ? t('lang.en') : t('lang.vi')}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label={current === 'vi' ? t('lang.switchToVi') : t('lang.switchToEn')}
      className="flex rounded-md border border-tk-border p-0.5 text-xs"
    >
      <button
        type="button"
        onClick={() => handleChange('vi')}
        aria-pressed={current === 'vi'}
        aria-label={t('lang.switchToVi')}
        className={`rounded px-2 py-1 font-semibold transition-colors ${
          current === 'vi'
            ? SIDEBAR_ACTIVE_CLASSES
            : 'text-tk-text-2 hover:bg-tk-surface-hover'
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
            ? SIDEBAR_ACTIVE_CLASSES
            : 'text-tk-text-2 hover:bg-tk-surface-hover'
        }`}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}

type ThemeToggleProps = {
  theme: AppTheme
  onToggleTheme: () => void
  isCollapsed: boolean
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggleTheme, isCollapsed }) => {
  const { t } = useTranslation()

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={t('theme.toggle')}
        className="rounded-md p-1.5 text-tk-text-2 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label={t('theme.toggle')}
      className="flex rounded-md border border-tk-border p-0.5 text-xs"
    >
      <button
        type="button"
        onClick={() => {
          if (theme !== 'light') onToggleTheme()
        }}
        aria-pressed={theme === 'light'}
        aria-label={t('theme.light')}
        className={`flex items-center gap-1 rounded px-2 py-1 font-semibold transition-colors ${
          theme === 'light'
            ? SIDEBAR_ACTIVE_CLASSES
            : 'text-tk-text-2 hover:bg-tk-surface-hover'
        }`}
      >
        <SunIcon />
        {t('theme.light')}
      </button>
      <button
        type="button"
        onClick={() => {
          if (theme !== 'dark') onToggleTheme()
        }}
        aria-pressed={theme === 'dark'}
        aria-label={t('theme.dark')}
        className={`flex items-center gap-1 rounded px-2 py-1 font-semibold transition-colors ${
          theme === 'dark'
            ? SIDEBAR_ACTIVE_CLASSES
            : 'text-tk-text-2 hover:bg-tk-surface-hover'
        }`}
      >
        <MoonIcon />
        {t('theme.dark')}
      </button>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  isCollapsed,
  onToggleCollapsed,
  theme,
  onToggleTheme,
}) => {
  const { t } = useTranslation()

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-tk-border bg-tk-surface transition-all duration-200 ${
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
        className={`mt-auto flex flex-col gap-2 border-t border-tk-border p-2 ${
          isCollapsed ? 'items-center' : ''
        }`}
      >
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} isCollapsed={isCollapsed} />
        <LanguageSwitch isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

export default Sidebar
