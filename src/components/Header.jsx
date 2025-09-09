"use client"
import { Search } from "lucide-react"
import { useTodo } from "../context/TodoContext"

function Header() {
  const { searchQuery, actions } = useTodo()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
        </div>

        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => actions.setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
