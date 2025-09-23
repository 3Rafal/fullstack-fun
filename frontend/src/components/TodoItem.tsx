import type { Todo } from '../types/todo';
import type { TodoUpdateRequest } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number, req: TodoUpdateRequest) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onToggleComplete(todo.id, { name: todo.name, isComplete: !todo.isComplete });
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <li className={`todo-item ${todo.isComplete ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.isComplete}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <span className="todo-text">{todo.name}</span>
      </div>
      <button
        onClick={handleDelete}
        className="delete-button"
        aria-label="Delete todo"
      >
        ×
      </button>
    </li>
  );
}