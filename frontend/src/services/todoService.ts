import { apiClient, ApiError } from './api';
import type { Todo } from '../types/todo';

export interface TodoCreateRequest {
  name: string;
  isComplete?: boolean;
}

export interface TodoUpdateRequest {
  name?: string;
  isComplete?: boolean;
}

class TodoService {
  private getEndpoint(id?: number): string {
    return id !== undefined ? `/${id}` : '';
  }

  async getTodos(): Promise<Todo[]> {
    try {
      const response = await apiClient.get<Todo[]>(this.getEndpoint());
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch todos: ${error.message}`);
      }
      throw new Error('Failed to fetch todos due to network error');
    }
  }

  async getCompletedTodos(): Promise<Todo[]> {
    try {
      const response = await apiClient.get<Todo[]>('/complete');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch completed todos: ${error.message}`);
      }
      throw new Error('Failed to fetch completed todos due to network error');
    }
  }

  async getTodoById(id: number): Promise<Todo> {
    try {
      const response = await apiClient.get<Todo>(this.getEndpoint(id));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch todo with id ${id}: ${error.message}`);
      }
      throw new Error(`Failed to fetch todo with id ${id} due to network error`);
    }
  }

  async createTodo(todo: TodoCreateRequest): Promise<Todo> {
    try {
      const response = await apiClient.post<Todo, TodoCreateRequest>(
        this.getEndpoint(),
        todo
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create todo: ${error.message}`);
      }
      throw new Error('Failed to create todo due to network error');
    }
  }

  async updateTodo(id: number, todo: TodoUpdateRequest): Promise<void> {
    try {
      await apiClient.put<void, TodoUpdateRequest>(this.getEndpoint(id), todo);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update todo with id ${id}: ${error.message}`);
      }
      throw new Error(`Failed to update todo with id ${id} due to network error`);
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(this.getEndpoint(id));
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to delete todo with id ${id}: ${error.message}`);
      }
      throw new Error(`Failed to delete todo with id ${id} due to network error`);
    }
  }
}

export const todoService = new TodoService();
export { TodoService };