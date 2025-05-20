export type TodoStatus = "done" | "not-done" | "pending";

export interface Todo {
  id: string;
  project: string;
  subProject: string;
  task: string;
  jira: string;
  notes: string;
  order: number;
  timeEstimate: string;
  status: TodoStatus;
}

export interface TodoGroup {
  project: string;
  subProjects: {
    name: string;
    todos: Todo[];
  }[];
}
