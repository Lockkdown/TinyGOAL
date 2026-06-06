import { useCallback, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Modal from './components/shared/Modal'
import TaskForm from './components/TaskForm/TaskForm'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTasks } from './hooks/useTasks'
import type { ActiveView, BoardLayout, Task } from './types'
import DashboardView from './views/DashboardView'
import TaskView from './views/TaskView'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('task')
  const [sidebarState, setSidebarState] = useLocalStorage<'expanded' | 'collapsed'>(
    'tinygoal-sidebar',
    'expanded',
  )
  const [boardLayout, setBoardLayout] = useLocalStorage<BoardLayout>('tinygoal-view', 'board')
  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

  const isCollapsed = sidebarState === 'collapsed'

  const handleToggleCollapsed = useCallback(() => {
    setSidebarState(isCollapsed ? 'expanded' : 'collapsed')
  }, [isCollapsed, setSidebarState])

  const handleAddTask = useCallback(() => {
    setEditingTask(null)
    setIsFormOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingTask(null)
  }, [])

  const handleFormSubmit = useCallback(
    (data: Omit<Task, 'id' | 'createdAt'>) => {
      if (editingTask) {
        updateTask(editingTask.id, data)
      } else {
        addTask(data)
      }
      handleCloseForm()
    },
    [editingTask, addTask, updateTask, handleCloseForm],
  )

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        isCollapsed={isCollapsed}
        onToggleCollapsed={handleToggleCollapsed}
      />
      <main className="flex-1">
        {activeView === 'task' ? (
          <TaskView
            tasks={tasks}
            moveTask={moveTask}
            deleteTask={deleteTask}
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
            boardLayout={boardLayout}
            onChangeBoardLayout={setBoardLayout}
          />
        ) : (
          <DashboardView tasks={tasks} />
        )}
      </main>
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTask ? 'Edit task' : 'Add task'}
      >
        <TaskForm
          key={editingTask?.id ?? 'new'}
          initialData={editingTask ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  )
}
