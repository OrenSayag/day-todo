import { useState } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import { updateTodo, deleteTodo, updateTodoStatus } from "@/lib/storage";

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

const STATUS_ORDER: TodoStatus[] = [
  "pending",
  "in-progress",
  "done",
  "not-done",
];

export default function TodoList({ todos, onUpdate }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTimeEstimate, setEditTimeEstimate] = useState("");
  const [editJira, setEditJira] = useState("");

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTask(todo.task);
    setEditNotes(todo.notes || "");
    setEditTimeEstimate(todo.timeEstimate || "");
    setEditJira(todo.jira || "");
  };

  const handleSave = (todo: Todo) => {
    if (editTask.trim()) {
      updateTodo(todo.id, {
        ...todo,
        task: editTask.trim(),
        notes: editNotes.trim(),
        timeEstimate: editTimeEstimate.trim(),
        jira: editJira.trim(),
      });
      onUpdate();
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
    onUpdate();
  };

  const handleStatusToggle = (todo: Todo) => {
    const currentStatus = todo.status;
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    handleStatusChange(todo.id, STATUS_ORDER[nextIndex]);
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    updateTodoStatus(id, status);
    onUpdate();
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-done":
        return "bg-red-100 text-red-800";
      case "done":
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
        >
          {editingId === todo.id ? (
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Task
                </label>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave(todo)}
                  className="w-full p-1 border rounded"
                  autoFocus
                  placeholder="Task"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jira issue
                </label>
                <input
                  type="text"
                  value={editJira}
                  onChange={(e) => setEditJira(e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="Jira issue (optional)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Time estimate
                </label>
                <input
                  type="text"
                  value={editTimeEstimate}
                  onChange={(e) => setEditTimeEstimate(e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="Time estimate (optional)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="Notes (optional)"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleSave(todo)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => handleStatusToggle(todo)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    todo.status
                  )}`}
                >
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                </button>
                <span
                  className={
                    todo.status === "done" ? "line-through text-gray-500" : ""
                  }
                >
                  {todo.task}
                </span>
              </div>
              <div className="ml-12 space-y-1 text-sm text-gray-600">
                {todo.jira && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Jira:</span>
                    <span>{todo.jira}</span>
                  </div>
                )}
                {todo.timeEstimate && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Time:</span>
                    <span>{todo.timeEstimate}</span>
                  </div>
                )}
                {todo.notes && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Notes:</span>
                    <span>{todo.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex space-x-2 ml-4">
            {editingId !== todo.id && (
              <button
                onClick={() => handleEdit(todo)}
                className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(todo.id)}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
