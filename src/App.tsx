import { useCallback, useMemo, useState } from 'react'
import type { Task } from './types'
import Board from './components/Board/Board'
import Dashboard from './components/Dashboard/Dashboard'
import Modal from './components/shared/Modal'
import TaskForm from './components/TaskForm/TaskForm'
import { useTasks } from './hooks/useTasks'
import { getStats } from './utils/helpers'

type ActiveView = 'board' | 'dashboard'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('board')

  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

  const stats = useMemo(() => getStats(tasks), [tasks])

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
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">TinyGOAL</h1>
            <div
              role="tablist"
              aria-label="Switch view"
              className="flex rounded-lg bg-slate-100 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'board'}
                id="tab-board"
                aria-controls="board-panel"
                onClick={() => setActiveView('board')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeView === 'board'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Board
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'dashboard'}
                id="tab-dashboard"
                aria-controls="dashboard-panel"
                onClick={() => setActiveView('dashboard')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddTask}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </header>
      {activeView === 'board' ? (
        <Board
          tasks={tasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
          onEditTask={handleEditTask}
        />
      ) : (
        <div
          id="dashboard-panel"
          role="tabpanel"
          aria-labelledby="tab-dashboard"
          className="mx-auto w-full max-w-6xl px-4 pb-8"
        >
          <Dashboard stats={stats} />
        </div>
      )}
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
