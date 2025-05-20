import { useState, useEffect } from "react";
import { Todo, TodoGroup } from "./types/todo";
import { getTodos, saveTodos } from "./lib/storage";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    project: "",
    subProject: "",
    task: "",
    jira: "",
    notes: "",
    order: 0,
    timeEstimate: "",
  });

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAddTodo = () => {
    if (!newTodo.project || !newTodo.task) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      project: newTodo.project,
      subProject: newTodo.subProject || "",
      task: newTodo.task,
      jira: newTodo.jira || "",
      notes: newTodo.notes || "",
      order: newTodo.order || 0,
      timeEstimate: newTodo.timeEstimate || "",
      status: "pending",
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodo({
      project: "",
      subProject: "",
      task: "",
      jira: "",
      notes: "",
      order: 0,
      timeEstimate: "",
    });
  };

  const handleUpdate = () => {
    setTodos(getTodos());
  };

  const groupedTodos = todos.reduce((acc: TodoGroup[], todo) => {
    const projectGroup = acc.find((group) => group.project === todo.project);
    if (projectGroup) {
      const subProject = projectGroup.subProjects.find(
        (sp) => sp.name === todo.subProject
      );
      if (subProject) {
        subProject.todos.push(todo);
      } else {
        projectGroup.subProjects.push({
          name: todo.subProject,
          todos: [todo],
        });
      }
    } else {
      acc.push({
        project: todo.project,
        subProjects: [
          {
            name: todo.subProject,
            todos: [todo],
          },
        ],
      });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Project"
              value={newTodo.project}
              onChange={(e) =>
                setNewTodo({ ...newTodo, project: e.target.value })
              }
            />
            <Input
              placeholder="Sub Project"
              value={newTodo.subProject}
              onChange={(e) =>
                setNewTodo({ ...newTodo, subProject: e.target.value })
              }
            />
            <Input
              placeholder="Task"
              value={newTodo.task}
              onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
            />
            <Input
              placeholder="Jira"
              value={newTodo.jira}
              onChange={(e) => setNewTodo({ ...newTodo, jira: e.target.value })}
            />
            <Input
              placeholder="Notes"
              value={newTodo.notes}
              onChange={(e) =>
                setNewTodo({ ...newTodo, notes: e.target.value })
              }
            />
            <Input
              placeholder="Time Estimate"
              value={newTodo.timeEstimate}
              onChange={(e) =>
                setNewTodo({ ...newTodo, timeEstimate: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddTodo} className="mt-4">
            Add Todo
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {groupedTodos.map((group) => (
          <Card key={group.project}>
            <CardHeader>
              <CardTitle>{group.project}</CardTitle>
            </CardHeader>
            <CardContent>
              {group.subProjects.map((subProject) => (
                <div key={subProject.name} className="mb-4">
                  {subProject.name && (
                    <h3 className="text-lg font-semibold mb-2">
                      {subProject.name}
                    </h3>
                  )}
                  <TodoList todos={subProject.todos} onUpdate={handleUpdate} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
