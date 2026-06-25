import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FocusSettingsPanel } from '../components/Focus/FocusSettingsPanel'
import { PomodoroRing } from '../components/Focus/PomodoroRing'
import { TaskPickerPanel } from '../components/Focus/TaskPickerPanel'
import { GearIcon } from '../components/shared/icons'
import type { FocusViewProps } from '../types'
import { formatMs } from '../utils/helpers'

export const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  countdown,
  config,
  onConfigChange,
  phase,
  progress,
  onSkipBreak,
  onPause,
  onResume,
  onEnd,
  todaySummary,
}) => {
  const { t } = useTranslation()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null),
    [tasks, selectedTaskId],
  )

  const label = formatMs(countdown.remainingMs)
  const phaseLabel = phase === 'focus' ? t('focus.phaseFocus') : t('focus.phaseBreak')
  const taskLabel = selectedTask?.title ?? t('focus.selectTask')
  const isActive = countdown.status !== 'idle'
  const timerStatus = countdown.status

  return (
    <div
      id="focus-panel"
      role="tabpanel"
      aria-labelledby="nav-focus"
      className="relative mx-auto flex w-full max-w-lg flex-col px-4 py-10"
    >
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        disabled={isActive}
        aria-label={t('focus.settings')}
        className="absolute right-4 top-4 rounded p-1.5 text-tk-text-3 transition-colors hover:bg-tk-surface-hover hover:text-tk-text-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GearIcon />
      </button>

      <div className="relative mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={isActive}
          className="inline-flex items-center gap-1 text-sm font-medium text-tk-text-2 transition-colors hover:text-tk-text-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t('nav.focus')}</span>
          <span aria-hidden="true">&gt;</span>
          <span className="max-w-[200px] truncate text-tk-text-1">{taskLabel}</span>
        </button>
        {pickerOpen && (
          <TaskPickerPanel
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={onSelectTask}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>

      <p className="mb-2 text-center text-sm font-medium text-tk-text-2">{phaseLabel}</p>

      <div role="timer" aria-live="off" className="mb-2 flex justify-center">
        <PomodoroRing progress={progress} label={label} variant={phase} />
      </div>

      {timerStatus === 'paused' && (
        <p className="mb-8 text-center text-sm text-tk-text-3">{t('focus.paused')}</p>
      )}
      {timerStatus !== 'paused' && <div className="mb-8" />}

      <div className="flex flex-col items-center gap-3">
        {timerStatus === 'idle' && (
          <button
            type="button"
            onClick={countdown.start}
            aria-label={t('focus.start')}
            className="rounded-lg bg-tk-accent px-8 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t('focus.start')}
          </button>
        )}

        {timerStatus === 'running' && (
          <button
            type="button"
            onClick={onPause}
            aria-label={t('focus.pause')}
            className="rounded-lg bg-tk-accent px-8 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t('focus.pause')}
          </button>
        )}

        {timerStatus === 'paused' && (
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onResume}
              aria-label={t('focus.continue')}
              className="rounded-lg bg-tk-accent px-8 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t('focus.continue')}
            </button>
            <button
              type="button"
              onClick={onEnd}
              aria-label={t('focus.end')}
              className="rounded-lg border border-tk-border px-8 py-2.5 text-sm font-medium text-tk-text-1 transition-colors hover:bg-tk-surface-hover"
            >
              {t('focus.end')}
            </button>
          </div>
        )}

        {phase === 'break' && (
          <button
            type="button"
            onClick={onSkipBreak}
            className="text-xs font-medium text-tk-text-3 transition-colors hover:text-tk-text-2"
          >
            {t('focus.skipBreak')}
          </button>
        )}

        <p className="mt-4 text-center text-xs text-tk-text-3">
          {t('focus.todaySummary', {
            sessions: todaySummary.sessions,
            minutes: todaySummary.minutes,
          })}
        </p>
      </div>

      {settingsOpen && (
        <FocusSettingsPanel
          config={config}
          onChange={onConfigChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default FocusView
