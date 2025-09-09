"use client"

import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useTodo } from "../context/TodoContext"
import Header from "./Header"
import Sidebar from "./Sidebar"
import TodoList from "./TodoList"
import AddTodoForm from "./AddTodoForm"
import Modal from "./Modal"
import { Plus } from "lucide-react"

function TodoApp() {
  const { filteredTodos, actions, loading } = useTodo()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(filteredTodos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    actions.reorderTodos(items)
  }

  const handleTodoAdded = () => {
    setShowAddModal(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Add Todo Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddModal(true)}
                disabled={loading.creating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 animate-fade-in disabled:opacity-50"
              >
                {loading.creating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus size={20} />
                )}
                Add New Task
              </button>
            </div>

            {/* Todo List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <TodoList todos={filteredTodos} />
            </DragDropContext>

            {/* Empty State */}
            {filteredTodos.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No tasks found</h3>
                <p className="text-gray-500">Click "Add New Task" to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task" size="md">
        <AddTodoForm onClose={handleTodoAdded} />
      </Modal>
    </div>
  )
}

export default TodoApp
