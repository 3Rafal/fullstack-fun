import { useState } from 'react';
import type { Todo } from '../types/todo';
import type { TodoUpdateRequest } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number, req: TodoUpdateRequest) => void;
  onUpdate: (id: number, req: TodoUpdateRequest) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggleComplete, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.name);

  const handleToggle = () => {
    onToggleComplete(todo.id, { name: todo.name, isComplete: !todo.isComplete });
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim() !== '') {
      onUpdate(todo.id, { name: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
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
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <span
            className="todo-text"
            onClick={handleEdit}
            style={{ cursor: 'pointer', flex: 1, display: 'block' }}
          >
            {todo.name}
          </span>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="save-button"
              aria-label="Save todo"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="cancel-button"
              aria-label="Cancel edit"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            onClick={handleDelete}
            className="delete-button"
            aria-label="Delete todo"
          >
            ×
          </button>
        )}
      </div>
    </li>
  );
}