"use client";

import { useState } from "react";
import { useTodo } from "../context/TodoContext";
import { Folder, Plus, X, Tag } from "lucide-react";

function Sidebar() {
  const { folders, todos, filter, actions } = useTodo();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const colors = [
    "blue",
    "green",
    "purple",
    "red",
    "yellow",
    "pink",
    "indigo",
    "gray",
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      actions.addFolder({ name: newFolderName.trim(), color: selectedColor });
      setNewFolderName("");
      setShowAddFolder(false);
      setSelectedColor("blue");
    }
  };

  const getFolderTaskCount = (folderId) => {
    return todos.filter((todo) => todo.folderId === folderId).length;
  };

  const getAllTags = () => {
    const tagSet = new Set();
    todos.forEach((todo) => {
      todo.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const getTagTaskCount = (tag) => {
    return todos.filter((todo) => todo.tags.includes(tag)).length;
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6">
      {/* Folders Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
          <button
            onClick={() => setShowAddFolder(true)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add Folder Form */}
        {showAddFolder && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg animate-slide-in">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input-field mb-3"
              onKeyPress={(e) => e.key === "Enter" && handleAddFolder()}
            />

            <div className="flex gap-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color
                      ? "ring-2 ring-offset-1 ring-gray-400"
                      : ""
                  } ${colorClasses[color].split(" ")[0]}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddFolder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 animate-fade-in disabled:opacity-50 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddFolder(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* All Tasks */}
        <button
          onClick={() => actions.setFilter({ folderId: null, tags: [] })}
          className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
            !filter.folderId ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <Folder size={18} />
            <span>All Tasks</span>
          </div>
          <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </button>

        {/* Folder List */}
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center gap-2 mb-2">
            <button
              onClick={() =>
                actions.setFilter({ folderId: folder.id, tags: [] })
              }
              className={`flex-1 flex items-center justify-between p-3 rounded-lg transition-colors ${
                filter.folderId === folder.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    colorClasses[folder.color].split(" ")[0]
                  }`}
                />
                <span>{folder.name}</span>
              </div>
              <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                {getFolderTaskCount(folder.id)}
              </span>
            </button>

            {folder.id !== "default" && (
              <button
                onClick={() => actions.deleteFolder(folder.id)}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tags Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

        {getAllTags().length === 0 ? (
          <p className="text-gray-500 text-sm">
            No tags yet. Add tags to your tasks to see them here.
          </p>
        ) : (
          <div className="space-y-2">
            {getAllTags().map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const isSelected = filter.tags.includes(tag);
                  const newTags = isSelected
                    ? filter.tags.filter((t) => t !== tag)
                    : [...filter.tags, tag];
                  actions.setFilter({ ...filter, tags: newTags });
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                  filter.tags.includes(tag)
                    ? "bg-purple-50 text-purple-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  <span className="text-sm">{tag}</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {getTagTaskCount(tag)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
