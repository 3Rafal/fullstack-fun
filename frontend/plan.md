# Frontend ToDo Application Development Plan

## Overview
This plan outlines the development of a React-based ToDo application frontend that will fully utilize the existing .NET Web API backend. The backend provides CRUD operations for ToDo items with an in-memory database.

## Backend API Analysis

### Available Endpoints (Base URL: `/todoitems`)
- `GET /` - Get all todos
- `GET /complete` - Get completed todos only
- `GET /{id}` - Get specific todo by ID
- `POST /` - Create new todo
- `PUT /{id}` - Update existing todo
- `DELETE /{id}` - Delete todo

### Todo Model
```typescript
interface Todo {
  id: number;
  name: string;
  isComplete: boolean;
}
```

### Database Seed Data
- "Learn .NET" (incomplete)
- "Build an API" (complete)

## Tech Stack
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (existing App.css)
- **API Client**: Native fetch API
- **Linting**: ESLint with React plugins

## Development Steps

### Phase 0: Project Cleanup
- [ ] **Clean Up Template Files**
  - Remove template code from `src/App.tsx`
  - Clear template styles from `src/App.css`
  - Remove unused template assets (react.svg, vite.svg)
  - Clean up any other template-related files

### Phase 1: Project Setup and API Integration
- [ ] **Create API Service Layer**
  - Create `src/services/api.ts` for HTTP client configuration
  - Implement base API class with error handling
  - Set up TypeScript interfaces for API responses

- [ ] **Create Todo Service**
  - Create `src/services/todoService.ts`
  - Implement all CRUD operations matching backend endpoints
  - Add proper error handling and loading states
  - Include TypeScript types for all API interactions

### Phase 2: Core Components
- [ ] **Todo Type Definitions**
  - Create `src/types/todo.ts` with Todo interface
  - Add types for API responses and error handling

- [ ] **Todo List Component**
  - Create `src/components/TodoList.tsx`
  - Display all todos with checkboxes for completion status
  - Include delete functionality for each item
  - Add loading and error states

- [ ] **Todo Item Component**
  - Create `src/components/TodoItem.tsx`
  - Individual todo item with name, checkbox, and delete button
  - Handle completion toggle and delete operations
  - Add proper styling and hover effects

- [ ] **Add Todo Form Component**
  - Create `src/components/AddTodoForm.tsx`
  - Input field for new todo name
  - Submit button with form validation
  - Clear form after successful submission

### Phase 3: State Management
- [ ] **Custom Hooks for State Management**
  - Create `src/hooks/useTodos.ts` for managing todo state
  - Implement `src/hooks/useApi.ts` for common API operations
  - Add loading, error, and success state handling

- [ ] **Context Provider (Optional)**
  - Consider creating `src/context/TodoContext.tsx` for global state
  - Include todos, loading states, and API operations in context

### Phase 4: Main Application
- [ ] **Update App Component**
  - Replace existing template with todo application
  - Integrate all components and state management
  - Add proper layout and styling

- [ ] **Error Handling and User Feedback**
  - Add toast notifications or inline error messages
  - Implement loading spinners for async operations
  - Add success feedback for completed operations

### Phase 5: Styling and UX
- [ ] **Enhance Styling**
  - Update `src/App.css` with todo-specific styles
  - Add responsive design for mobile devices
  - Include animations and transitions for better UX

- [ ] **Filtering and Search**
  - Add filter options (All, Active, Complete)
  - Implement search functionality for todo names
  - Update UI to show current filter state

### Phase 6: Additional Features
- [ ] **Todo Editing**
  - Add inline editing capability for todo names
  - Include save/cancel options for editing
  - Add validation for edited names

- [ ] **Local Storage Integration**
  - Cache todos in local storage for offline capability
  - Sync with API when connection is restored
  - Handle conflicts between local and remote data

- [ ] **Statistics Dashboard**
  - Show total todos, completed count, completion percentage
  - Add visual progress indicators
  - Display statistics in a dashboard view

## Implementation Details

### File Structure
```
src/
├── components/
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── AddTodoForm.tsx
│   └── TodoFilters.tsx
├── services/
│   ├── api.ts
│   └── todoService.ts
├── hooks/
│   ├── useTodos.ts
│   └── useApi.ts
├── types/
│   └── todo.ts
├── context/
│   └── TodoContext.tsx
├── App.tsx
└── main.tsx
```

### API Service Implementation
```typescript
// Base API configuration
const API_BASE_URL = 'http://localhost:5000/todoitems';

// Todo service methods
- getTodos(): Promise<Todo[]>
- getCompletedTodos(): Promise<Todo[]>
- getTodoById(id: number): Promise<Todo>
- createTodo(todo: Omit<Todo, 'id'>): Promise<Todo>
- updateTodo(id: number, todo: Partial<Todo>): Promise<void>
- deleteTodo(id: number): Promise<void>
```

### State Management Approach
- Use React hooks (`useState`, `useEffect`) for local component state
- Custom hooks for reusable logic and API calls
- Context API for global state sharing between components
- Proper error boundaries and loading states