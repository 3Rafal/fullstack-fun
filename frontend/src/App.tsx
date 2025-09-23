import { useState, useCallback } from 'react';
import './App.css'
import TodoList from './components/TodoList'
import { AddTodoForm } from './components/AddTodoForm'
import { todoService } from './services/todoService'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddTodo = useCallback(async (name: string) => {
    await todoService.createTodo({ name, isComplete: false });
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="App">
      <h1>Todo Application</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default App
