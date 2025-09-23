import { useState } from 'react';

interface AddTodoFormProps {
  onAddTodo: (name: string) => Promise<void>;
}

export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [todoName, setTodoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todoName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTodo(todoName.trim());
      setTodoName('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
        placeholder="Add a new todo..."
        disabled={isSubmitting}
        className="todo-input"
      />
      <button
        type="submit"
        disabled={!todoName.trim() || isSubmitting}
        className="add-button"
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}