import { useCallback, useState } from 'react'
import Header from './components/layout/Header'
import Modal from './components/shared/Modal'
import TaskForm from './components/TaskForm/TaskForm'
import { useTasks } from './hooks/useTasks'
import type { ActiveView, Task } from './types'
import BoardView from './views/BoardView'
import DashboardView from './views/DashboardView'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>('board')
  const { tasks, addTask, updateTask, moveTask, deleteTask } = useTasks()

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
      <Header
        activeView={activeView}
        onChangeView={setActiveView}
        onAddTask={handleAddTask}
      />
      {activeView === 'board' ? (
        <BoardView
          tasks={tasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
          onEditTask={handleEditTask}
        />
      ) : (
        <DashboardView tasks={tasks} />
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
