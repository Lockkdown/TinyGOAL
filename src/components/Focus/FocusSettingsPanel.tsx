import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FocusSettingsPanelProps } from '../../types'
import {
  BREAK_MINUTES_OPTIONS,
  FOCUS_MINUTES_OPTIONS,
} from '../shared/fieldOptions'
import { ModalPortal } from '../shared/ModalPortal'

const SEGMENT_ACTIVE =
  'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100'
const SEGMENT_INACTIVE = 'text-tk-text-2 hover:bg-tk-surface-hover'

type MinutesRowProps = {
  label: string
  value: number
  options: readonly number[]
  ariaLabel: string
  onChange: (minutes: number) => void
}

const MinutesRow: React.FC<MinutesRowProps> = ({
  label,
  value,
  options,
  ariaLabel,
  onChange,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2 py-3">
      <p className="text-sm font-medium text-tk-text-1">{label}</p>
      <div
        role="group"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-1 rounded-md border border-tk-border p-0.5 text-xs"
      >
        {options.map((minutes) => (
          <button
            key={minutes}
            type="button"
            aria-pressed={value === minutes}
            onClick={() => onChange(minutes)}
            className={`rounded px-2 py-1 font-semibold transition-colors ${
              value === minutes ? SEGMENT_ACTIVE : SEGMENT_INACTIVE
            }`}
          >
            {t('focus.minutes', { n: minutes })}
          </button>
        ))}
      </div>
    </div>
  )
}

export const FocusSettingsPanel: React.FC<FocusSettingsPanelProps> = ({
  config,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation()
  const [entered, setEntered] = useState(false)

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
          aria-labelledby="focus-settings-title"
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-tk-surface shadow-2xl transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between border-b border-tk-border px-4 py-3">
            <h2 id="focus-settings-title" className="text-sm font-semibold text-tk-text-1">
              {t('focus.settings')}
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
            <MinutesRow
              label={t('focus.focusTime')}
              value={config.focusMinutes}
              options={FOCUS_MINUTES_OPTIONS}
              ariaLabel={t('focus.focusTime')}
              onChange={(focusMinutes) => onChange({ ...config, focusMinutes })}
            />

            <hr className="border-tk-border-subtle" />

            <MinutesRow
              label={t('focus.breakTime')}
              value={config.breakMinutes}
              options={BREAK_MINUTES_OPTIONS}
              ariaLabel={t('focus.breakTime')}
              onChange={(breakMinutes) => onChange({ ...config, breakMinutes })}
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default FocusSettingsPanel
