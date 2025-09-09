"use client"

import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { useTodo } from "../context/TodoContext"
import ConfirmModal from "./ConfirmModal"
import { Edit2, Trash2, GripVertical, Tag } from "lucide-react"

function TodoItem({ todo, index }) {
  const { folders, actions, loading } = useTodo()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [editTags, setEditTags] = useState(todo.tags.join(", "))
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const folder = folders.find((f) => f.id === todo.folderId)

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    pink: "bg-pink-100 text-pink-800",
    indigo: "bg-indigo-100 text-indigo-800",
    gray: "bg-gray-100 text-gray-800",
  }

  const handleSave = () => {
    const tags = editTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    actions.updateTodo(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      tags,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setEditTags(todo.tags.join(", "))
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    await actions.deleteTodo(todo.id)
    setShowDeleteModal(false)
  }

  const isDeleting = loading.deleting === todo.id

  return (
    <>
      <Draggable draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 animate-fade-in ${
              snapshot.isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
            } ${isDeleting ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-4">
              {/* Drag Handle */}
              <div
                {...provided.dragHandleProps}
                className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              >
                <GripVertical size={20} />
              </div>

              {/* Content */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                      placeholder="Task title"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Task description"
                    />
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tags (comma separated)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-gray-900">{todo.title}</h3>

                    {todo.description && <p className="text-gray-600 mb-3">{todo.description}</p>}

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Folder Badge */}
                      {folder && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[folder.color]}`}>
                          {folder.name}
                        </span>
                      )}

                      {/* Tags */}
                      {todo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}

                      {/* Timestamp */}
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  )
}

export default TodoItem
