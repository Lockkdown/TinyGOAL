import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import SettingsPanel from './components/Settings/SettingsPanel'
import TaskDetailPanel from './components/TaskDetail/TaskDetailPanel'
import QuickAddTask from './components/TaskForm/QuickAddTask'
import { useCountdown } from './hooks/useCountdown'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import type { ActiveView, BoardLayout, PomodoroSession, Task } from './types'
import { todayDateKey } from './utils/helpers'
import DashboardView from './views/DashboardView'
import FocusView from './views/FocusView'
import TaskView from './views/TaskView'

const POMO_MINUTES = 20
const POMO_DURATION_MS = POMO_MINUTES * 60 * 1000

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null)
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('task')
  const [sidebarState, setSidebarState] = useLocalStorage<'expanded' | 'collapsed'>(
    'tinygoal-sidebar',
    'expanded',
  )
  const [boardLayout, setBoardLayout] = useLocalStorage<BoardLayout>('tinygoal-view', 'board')
  const [pomoSessions, setPomoSessions] = useLocalStorage<PomodoroSession[]>(
    'tinygoal-pomo-sessions',
    [],
  )
  const { theme, toggleTheme } = useTheme()
  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

  const focusTaskIdRef = useRef(focusTaskId)
  const tasksRef = useRef(tasks)

  useEffect(() => {
    focusTaskIdRef.current = focusTaskId
  }, [focusTaskId])

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const handleSessionComplete = useCallback(() => {
    const taskId = focusTaskIdRef.current
    setPomoSessions([
      ...pomoSessions,
      { date: todayDateKey(), minutes: POMO_MINUTES, taskId },
    ])

    if (!taskId) return

    const task = tasksRef.current.find((t) => t.id === taskId)
    if (!task) return

    const nextCount = (task.pomodoroCount ?? 0) + 1
    if (task.status === 'Todo') {
      updateTask(taskId, { pomodoroCount: nextCount, status: 'In Progress' })
    } else {
      updateTask(taskId, { pomodoroCount: nextCount })
    }
  }, [pomoSessions, setPomoSessions, updateTask])

  const countdown = useCountdown(POMO_DURATION_MS, handleSessionComplete)

  const activeDetail = tasks.find((t) => t.id === detailTaskId) ?? null

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
        {activeView === 'statistic' && <DashboardView tasks={tasks} />}
        {activeView === 'focus' && (
          <FocusView
            tasks={tasks}
            selectedTaskId={focusTaskId}
            onSelectTask={setFocusTaskId}
            countdown={countdown}
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
