import { useCallback, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import SettingsPanel from './components/Settings/SettingsPanel'
import TaskDetailPanel from './components/TaskDetail/TaskDetailPanel'
import QuickAddTask from './components/TaskForm/QuickAddTask'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import type { ActiveView, BoardLayout, Task } from './types'
import DashboardView from './views/DashboardView'
import TaskView from './views/TaskView'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('task')
  const [sidebarState, setSidebarState] = useLocalStorage<'expanded' | 'collapsed'>(
    'tinygoal-sidebar',
    'expanded',
  )
  const [boardLayout, setBoardLayout] = useLocalStorage<BoardLayout>('tinygoal-view', 'board')
  const { theme, toggleTheme } = useTheme()
  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

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
        {activeView === 'task' ? (
          <TaskView
            tasks={tasks}
            moveTask={moveTask}
            onAddTask={handleAddTask}
            onOpenTask={handleOpenTask}
            boardLayout={boardLayout}
            onChangeBoardLayout={setBoardLayout}
          />
        ) : (
          <DashboardView tasks={tasks} />
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
