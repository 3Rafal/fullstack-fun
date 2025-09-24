import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo';
import { todoService, type TodoUpdateRequest } from '../services/todoService';
import TodoItem from './TodoItem';

interface TodoListProps {
  refreshTrigger?: number;
  onRefreshComplete?: () => void;
}

export default function TodoList({ refreshTrigger, onRefreshComplete }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await todoService.getTodos();
      setTodos(todosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
      onRefreshComplete?.();
    }
  }, [onRefreshComplete]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos, refreshTrigger]);

  const handleToggleComplete = async (id: number, request: TodoUpdateRequest) => {
    try {
      await todoService.updateTodo(id, request);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleUpdate = async (id: number, request: TodoUpdateRequest) => {
    try {
      await todoService.updateTodo(id, request);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="todo-list error">
        <div className="error-message">{error}</div>
        <button onClick={fetchTodos} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list empty">
        <div className="empty-message">No todos yet. Add one above!</div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <ul className="todo-items">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}