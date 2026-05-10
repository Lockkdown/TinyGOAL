import { useCallback, useState } from 'react'
import type { Task } from './types'
import Board from './components/Board/Board'
import Modal from './components/shared/Modal'
import TaskForm from './components/TaskForm/TaskForm'
import { useTasks } from './hooks/useTasks'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { filteredTasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900">TinyGOAL</h1>
          <button
            type="button"
            onClick={handleAddTask}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </header>
      <Board
        filteredTasks={filteredTasks}
        moveTask={moveTask}
        deleteTask={deleteTask}
        onEditTask={handleEditTask}
      />
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
