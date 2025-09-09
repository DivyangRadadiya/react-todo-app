"use client"

import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

const TodoContext = createContext()

// Action types
const ACTIONS = {
  LOAD_TODOS: "LOAD_TODOS",
  ADD_TODO: "ADD_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  DELETE_TODO: "DELETE_TODO",
  REORDER_TODOS: "REORDER_TODOS",
  ADD_FOLDER: "ADD_FOLDER",
  DELETE_FOLDER: "DELETE_FOLDER",
  SET_FILTER: "SET_FILTER",
  SET_SEARCH: "SET_SEARCH",
  SET_LOADING: "SET_LOADING",
}

// Initial state
const initialState = {
  todos: [],
  folders: [{ id: "default", name: "General", color: "blue" }],
  filter: {
    folderId: null,
    tags: [],
  },
  searchQuery: "",
  loading: {
    creating: false,
    deleting: null, // Will store the ID of the todo being deleted
  },
}

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_TODOS:
      return {
        ...state,
        todos: action.payload.todos || [],
        folders: action.payload.folders || state.folders,
      }

    case ACTIONS.ADD_TODO:
      const newTodo = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        folderId: action.payload.folderId || "default",
        tags: action.payload.tags || [],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return {
        ...state,
        todos: [...state.todos, newTodo],
      }

    case ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : todo,
        ),
      }

    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      }

    case ACTIONS.REORDER_TODOS:
      return {
        ...state,
        todos: action.payload.todos,
      }

    case ACTIONS.ADD_FOLDER:
      const newFolder = {
        id: uuidv4(),
        name: action.payload.name,
        color: action.payload.color || "blue",
      }
      return {
        ...state,
        folders: [...state.folders, newFolder],
      }

    case ACTIONS.DELETE_FOLDER:
      return {
        ...state,
        folders: state.folders.filter((folder) => folder.id !== action.payload.id),
        todos: state.todos.map((todo) =>
          todo.folderId === action.payload.id ? { ...todo, folderId: "default" } : todo,
        ),
      }

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      }

    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchQuery: action.payload,
      }

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, ...action.payload },
      }

    default:
      return state
  }
}

// Storage utilities - Minimized window usage and added error handling
const STORAGE_KEY = "react-todo-app-data"

const saveToStorage = (data) => {
  try {
    if (typeof Storage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      if (typeof CustomEvent !== "undefined") {
        document.dispatchEvent(new CustomEvent("todo-storage-update", { detail: data }))
      }
    }
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

const loadFromStorage = () => {
  try {
    if (typeof Storage !== "undefined") {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : null
    }
    return null
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
    return null
  }
}

// Provider component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  const handleStorageUpdate = useCallback((event) => {
    if (event.detail) {
      dispatch({ type: ACTIONS.LOAD_TODOS, payload: event.detail })
    }
  }, [])

  const handleStorageChange = useCallback((event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const data = JSON.parse(event.newValue)
        dispatch({ type: ACTIONS.LOAD_TODOS, payload: data })
      } catch (error) {
        console.error("Failed to parse storage data:", error)
      }
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    const savedData = loadFromStorage()
    if (savedData) {
      dispatch({ type: ACTIONS.LOAD_TODOS, payload: savedData })
    }
  }, [])

  // Save data whenever state changes
  useEffect(() => {
    const dataToSave = {
      todos: state.todos,
      folders: state.folders,
    }
    saveToStorage(dataToSave)
  }, [state.todos, state.folders])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("todo-storage-update", handleStorageUpdate)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("todo-storage-update", handleStorageUpdate)
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [handleStorageUpdate, handleStorageChange])

  // Action creators
  const actions = {
    addTodo: async (todoData) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { creating: true } })
      await new Promise((resolve) => setTimeout(resolve, 800))
      dispatch({ type: ACTIONS.ADD_TODO, payload: todoData })
      dispatch({ type: ACTIONS.SET_LOADING, payload: { creating: false } })
    },

    updateTodo: (id, updates) => dispatch({ type: ACTIONS.UPDATE_TODO, payload: { id, updates } }),

    deleteTodo: async (id) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { deleting: id } })
      await new Promise((resolve) => setTimeout(resolve, 600))
      dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } })
      dispatch({ type: ACTIONS.SET_LOADING, payload: { deleting: null } })
    },

    reorderTodos: (todos) => dispatch({ type: ACTIONS.REORDER_TODOS, payload: { todos } }),
    addFolder: (folderData) => dispatch({ type: ACTIONS.ADD_FOLDER, payload: folderData }),
    deleteFolder: (id) => dispatch({ type: ACTIONS.DELETE_FOLDER, payload: { id } }),
    setFilter: (filter) => dispatch({ type: ACTIONS.SET_FILTER, payload: filter }),
    setSearch: (query) => dispatch({ type: ACTIONS.SET_SEARCH, payload: query }),
  }

  // Filtered todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      const matchesTitle = todo.title.toLowerCase().includes(query)
      const matchesDescription = todo.description.toLowerCase().includes(query)
      const matchesTags = todo.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false
      }
    }

    if (state.filter.folderId && todo.folderId !== state.filter.folderId) {
      return false
    }

    if (state.filter.tags.length > 0) {
      const hasMatchingTag = state.filter.tags.some((tag) => todo.tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })

  const value = {
    ...state,
    filteredTodos,
    actions,
  }

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider")
  }
  return context
}
