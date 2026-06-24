import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PomodoroRing } from '../components/Focus/PomodoroRing'
import { TaskPickerPanel } from '../components/Focus/TaskPickerPanel'
import type { FocusViewProps } from '../types'
import { formatMs } from '../utils/helpers'

const POMO_DURATION_MS = 20 * 60 * 1000

export const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  countdown,
}) => {
  const { t } = useTranslation()
  const [pickerOpen, setPickerOpen] = useState(false)

  const selectedTask = useMemo(
    () => (selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null),
    [tasks, selectedTaskId],
  )

  const progress = countdown.remainingMs / POMO_DURATION_MS
  const label = formatMs(countdown.remainingMs)

  const taskLabel = selectedTask?.title ?? t('focus.selectTask')

  return (
    <div
      id="focus-panel"
      role="tabpanel"
      aria-labelledby="nav-focus"
      className="mx-auto flex w-full max-w-lg flex-col px-4 py-10"
    >
      <div className="relative mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={countdown.status === 'running'}
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

      <div role="timer" aria-live="off" className="mb-10 flex justify-center">
        <PomodoroRing progress={progress} label={label} />
      </div>

      <div className="flex justify-center">
        {countdown.status === 'running' ? (
          <button
            type="button"
            onClick={countdown.reset}
            aria-label={t('focus.reset')}
            className="rounded-lg bg-tk-accent px-8 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t('focus.reset')}
          </button>
        ) : (
          <button
            type="button"
            onClick={countdown.start}
            aria-label={t('focus.start')}
            className="rounded-lg bg-tk-accent px-8 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t('focus.start')}
          </button>
        )}
      </div>
    </div>
  )
}

export default FocusView
