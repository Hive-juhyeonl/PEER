"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Todo, TodoRequest } from "@/types";

const PRIORITY_COLORS = {
  LOW: "bg-gray-600",
  MEDIUM: "bg-blue-600",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-600",
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [subtaskParentId, setSubtaskParentId] = useState<number | null>(null);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const fetchTodos = () => {
    api.get<Todo[]>("/api/todos").then(setTodos).catch(() => {});
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    const body: TodoRequest = { title, priority };
    if (dueDate) body.dueDate = new Date(dueDate).toISOString();
    await api.post("/api/todos", body);
    setTitle("");
    setPriority("MEDIUM");
    setDueDate("");
    setShowForm(false);
    fetchTodos();
  };

  const handleToggle = async (id: number) => {
    await api.patch(`/api/todos/${id}/toggle`);
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/todos/${id}`);
    fetchTodos();
  };

  const handleAddSubtask = async (parentId: number) => {
    if (!subtaskTitle.trim()) return;
    await api.post("/api/todos", { title: subtaskTitle, parentId, priority: "MEDIUM" });
    setSubtaskTitle("");
    setSubtaskParentId(null);
    fetchTodos();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Todos</h1>
          <p className="text-gray-400 text-sm mt-1">
            {completedCount}/{todos.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Todo
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              autoFocus
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-500 hover:border-gray-300"
                }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 ${
                  todo.completed ? "text-gray-500 line-through" : "text-white"
                }`}
              >
                {todo.title}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded text-white ${
                  PRIORITY_COLORS[todo.priority]
                }`}
              >
                {todo.priority}
              </span>
              {todo.dueDate && (
                <span className="text-xs text-gray-400">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={() =>
                  setSubtaskParentId(subtaskParentId === todo.id ? null : todo.id)
                }
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                + Sub
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>

            {todo.subtasks?.length > 0 && (
              <div className="ml-8 mt-2 space-y-1">
                {todo.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        sub.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {sub.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-sm ${
                        sub.completed ? "text-gray-600 line-through" : "text-gray-300"
                      }`}
                    >
                      {sub.title}
                    </span>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="text-gray-600 hover:text-red-400 text-xs ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {subtaskParentId === todo.id && (
              <div className="ml-8 mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Subtask title"
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtask(todo.id)}
                  className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
                <button
                  onClick={() => handleAddSubtask(todo.id)}
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        ))}

        {todos.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No todos yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
