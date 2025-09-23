export class ApiError extends Error {
  status?: number;
  statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText,
        );
}

      const data = response.status === 204 ? null : await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof SyntaxError) {
        throw new ApiError('Failed to parse response as JSON')
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T, B>(endpoint: string, data: B): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T, B>(endpoint: string, data: B): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}


function baseURL() {
  const fallback = 'http://localhost:5000/todoitems'

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || fallback
  }
  return fallback
}

// Default API client instance
export const apiClient = new ApiClient(baseURL());
export { ApiClient };