import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import SettingsPanel from './components/Settings/SettingsPanel'
import TaskDetailPanel from './components/TaskDetail/TaskDetailPanel'
import QuickAddTask from './components/TaskForm/QuickAddTask'
import { useCountdown } from './hooks/useCountdown'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import type {
  ActiveView,
  BoardLayout,
  PomodoroConfig,
  PomodoroPhase,
  PomodoroSession,
  Task,
} from './types'
import { getFocusTodayStats, todayDateKey } from './utils/helpers'
import DashboardView from './views/DashboardView'
import FocusView from './views/FocusView'
import TaskView from './views/TaskView'

const DEFAULT_POMO_CONFIG: PomodoroConfig = { focusMinutes: 25, breakMinutes: 5 }

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null)
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('task')
  const [pomoPhase, setPomoPhase] = useState<PomodoroPhase>('focus')
  const [sidebarState, setSidebarState] = useLocalStorage<'expanded' | 'collapsed'>(
    'tinygoal-sidebar',
    'expanded',
  )
  const [boardLayout, setBoardLayout] = useLocalStorage<BoardLayout>('tinygoal-view', 'board')
  const [pomoConfig, setPomoConfig] = useLocalStorage<PomodoroConfig>(
    'tinygoal-pomo-config',
    DEFAULT_POMO_CONFIG,
  )
  const [pomoSessions, setPomoSessions] = useLocalStorage<PomodoroSession[]>(
    'tinygoal-pomo-sessions',
    [],
  )
  const { theme, toggleTheme } = useTheme()
  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

  const focusTaskIdRef = useRef(focusTaskId)
  const tasksRef = useRef(tasks)
  const pomoConfigRef = useRef(pomoConfig)
  const pomoPhaseRef = useRef(pomoPhase)
  const pomoSessionsRef = useRef(pomoSessions)
  const autoStartBreakRef = useRef(false)
  const countdownStartRef = useRef<() => void>(() => {})

  useEffect(() => {
    focusTaskIdRef.current = focusTaskId
  }, [focusTaskId])

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  useEffect(() => {
    pomoConfigRef.current = pomoConfig
  }, [pomoConfig])

  useEffect(() => {
    pomoPhaseRef.current = pomoPhase
  }, [pomoPhase])

  useEffect(() => {
    pomoSessionsRef.current = pomoSessions
  }, [pomoSessions])

  const handlePhaseFinished = useCallback(() => {
    const phase = pomoPhaseRef.current
    const config = pomoConfigRef.current

    if (phase === 'focus') {
      const taskId = focusTaskIdRef.current
      setPomoSessions([
        ...pomoSessionsRef.current,
        { date: todayDateKey(), minutes: config.focusMinutes, taskId },
      ])

      if (taskId) {
        const task = tasksRef.current.find((t) => t.id === taskId)
        if (task) {
          const nextCount = (task.pomodoroCount ?? 0) + 1
          if (task.status === 'Todo') {
            updateTask(taskId, { pomodoroCount: nextCount, status: 'In Progress' })
          } else {
            updateTask(taskId, { pomodoroCount: nextCount })
          }
        }
      }

      autoStartBreakRef.current = true
      setPomoPhase('break')
    } else {
      setPomoPhase('focus')
    }
  }, [setPomoSessions, updateTask])

  const phaseDurationMs =
    (pomoPhase === 'focus' ? pomoConfig.focusMinutes : pomoConfig.breakMinutes) * 60 * 1000

  const countdown = useCountdown(phaseDurationMs, handlePhaseFinished)

  useEffect(() => {
    countdownStartRef.current = countdown.start
  }, [countdown.start])

  useEffect(() => {
    if (pomoPhase === 'break' && autoStartBreakRef.current) {
      autoStartBreakRef.current = false
      countdownStartRef.current()
    }
  }, [pomoPhase])

  const progress = countdown.remainingMs / phaseDurationMs

  const handleEndSession = useCallback(() => {
    autoStartBreakRef.current = false
    setPomoPhase('focus')
    countdown.reset()
  }, [countdown])

  const handleSkipBreak = useCallback(() => {
    autoStartBreakRef.current = false
    setPomoPhase('focus')
    countdown.reset()
  }, [countdown])

  const activeDetail = tasks.find((t) => t.id === detailTaskId) ?? null

  const focusToday = useMemo(() => getFocusTodayStats(pomoSessions), [pomoSessions])

  const isCollapsed = sidebarState === 'collapsed'

  const handleToggleCollapsed = useCallback(() => {
    setSidebarState(isCollapsed ? 'expanded' : 'collapsed')
  }, [isCollapsed, setSidebarState])

  const handleAddTask = useCallback(() => {
    setIsFormOpen(true)
  }, [])

  const handleOpenTask = useCallback((task: Task) => {
    setDetailTaskId(task.id)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  const handleFormSubmit = useCallback(
    (data: Omit<Task, 'id' | 'createdAt'>) => {
      addTask(data)
      handleCloseForm()
    },
    [addTask, handleCloseForm],
  )

  return (
    <div className="flex min-h-screen items-start bg-tk-bg">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        isCollapsed={isCollapsed}
        onToggleCollapsed={handleToggleCollapsed}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main className="flex-1">
        {activeView === 'task' && (
          <TaskView
            tasks={tasks}
            moveTask={moveTask}
            onAddTask={handleAddTask}
            onOpenTask={handleOpenTask}
            boardLayout={boardLayout}
            onChangeBoardLayout={setBoardLayout}
          />
        )}
        {activeView === 'statistic' && <DashboardView tasks={tasks} sessions={pomoSessions} />}
        {activeView === 'focus' && (
          <FocusView
            tasks={tasks}
            selectedTaskId={focusTaskId}
            onSelectTask={setFocusTaskId}
            countdown={countdown}
            config={pomoConfig}
            onConfigChange={setPomoConfig}
            phase={pomoPhase}
            progress={progress}
            onSkipBreak={handleSkipBreak}
            onPause={countdown.pause}
            onResume={countdown.resume}
            onEnd={handleEndSession}
            todaySummary={focusToday}
          />
        )}
      </main>
      {isFormOpen && (
        <QuickAddTask onSubmit={handleFormSubmit} onClose={handleCloseForm} />
      )}
      <TaskDetailPanel
        task={activeDetail}
        onClose={() => setDetailTaskId(null)}
        onSave={updateTask}
        onDelete={(id) => {
          deleteTask(id)
          setDetailTaskId(null)
        }}
      />
      {isSettingsOpen && (
        <SettingsPanel
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}
