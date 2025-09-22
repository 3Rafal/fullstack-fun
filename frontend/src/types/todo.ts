export interface Todo {
  id: number;
  name: string;
  isComplete: boolean;
}

export interface TodoCreateRequest {
  name: string;
  isComplete?: boolean;
}

export interface TodoUpdateRequest {
  name?: string;
  isComplete?: boolean;
}

export interface TodoApiResponse {
  todos: Todo[];
  total: number;
  completed: number;
  pending: number;
}