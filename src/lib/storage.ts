import { Todo, TodoStatus } from "@/types/todo";

const STORAGE_KEY = "todos";

export const getTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const addTodo = (todo: Todo) => {
  const todos = getTodos();
  todos.push({ ...todo, id: crypto.randomUUID(), status: "pending" });
  saveTodos(todos);
};

export const updateTodo = (id: string, todo: Todo) => {
  const todos = getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos[index] = todo;
    saveTodos(todos);
  }
};

export const deleteTodo = (id: string) => {
  const todos = getTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  saveTodos(filteredTodos);
};

export const updateTodoStatus = (id: string, status: TodoStatus) => {
  const todos = getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], status };
    saveTodos(todos);
  }
};
