import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setLanguage, type AppLanguage } from '../../i18n'
import type { AppTheme } from '../../types'
import { MoonIcon, SunIcon } from '../shared/icons'
import { ModalPortal } from '../shared/ModalPortal'

const SEGMENT_ACTIVE =
  'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'
const SEGMENT_INACTIVE = 'text-tk-text-2 hover:bg-tk-surface-hover'

type SettingsPanelProps = {
  onClose: () => void
  theme: AppTheme
  onToggleTheme: () => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  theme,
  onToggleTheme,
}) => {
  const { t, i18n } = useTranslation()
  const [entered, setEntered] = useState(false)
  const currentLang: AppLanguage = i18n.language.startsWith('vi') ? 'vi' : 'en'

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleLanguageChange = (lng: AppLanguage) => {
    if (lng !== currentLang) setLanguage(lng)
  }

  return (
    <ModalPortal>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-tk-surface shadow-2xl transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
        >
        <div className="flex items-center justify-between border-b border-tk-border px-4 py-3">
          <h2 id="settings-title" className="text-sm font-semibold text-tk-text-1">
            {t('settings.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('a11y.close')}
            className="rounded p-1 text-tk-text-3 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="flex flex-col px-4 py-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-tk-text-1">{t('settings.language')}</p>
              <p className="text-xs text-tk-text-3">{t('settings.languageDesc')}</p>
            </div>
            <div
              role="group"
              aria-label={t('settings.language')}
              className="flex shrink-0 rounded-md border border-tk-border p-0.5 text-xs"
            >
              <button
                type="button"
                onClick={() => handleLanguageChange('vi')}
                aria-pressed={currentLang === 'vi'}
                aria-label={t('lang.switchToVi')}
                className={`rounded px-2 py-1 font-semibold transition-colors ${
                  currentLang === 'vi' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE
                }`}
              >
                {t('lang.vi')}
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                aria-pressed={currentLang === 'en'}
                aria-label={t('lang.switchToEn')}
                className={`rounded px-2 py-1 font-semibold transition-colors ${
                  currentLang === 'en' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE
                }`}
              >
                {t('lang.en')}
              </button>
            </div>
          </div>

          <hr className="border-tk-border-subtle" />

          <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-tk-text-1">{t('settings.theme')}</p>
              <p className="text-xs text-tk-text-3">{t('settings.themeDesc')}</p>
            </div>
            <div
              role="group"
              aria-label={t('theme.toggle')}
              className="flex shrink-0 rounded-md border border-tk-border p-0.5 text-xs"
            >
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme()
                }}
                aria-pressed={theme === 'light'}
                aria-label={t('theme.light')}
                className={`flex items-center gap-1 rounded px-2 py-1 font-semibold transition-colors ${
                  theme === 'light' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE
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
                  theme === 'dark' ? SEGMENT_ACTIVE : SEGMENT_INACTIVE
                }`}
              >
                <MoonIcon />
                {t('theme.dark')}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default SettingsPanel
