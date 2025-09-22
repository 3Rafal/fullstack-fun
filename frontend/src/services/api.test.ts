import { ApiClient, ApiError } from './api';

// Mock global fetch
global.fetch = jest.fn();

// Type for accessing private properties in tests
interface TestApiClient {
  baseUrl: string;
  request: (endpoint: string, options?: RequestInit) => Promise<unknown>;
}


describe('ApiClient', () => {
  let apiClient: ApiClient;
  const mockBaseUrl = 'http://localhost:5000/todoitems';

  beforeEach(() => {
    apiClient = new ApiClient(mockBaseUrl);
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with correct base URL', () => {
      const testClient = apiClient as unknown as TestApiClient;
      expect(testClient.baseUrl).toBe('http://localhost:5000/todoitems');
    });
  });

  describe('Exported apiClient', () => {
    it('should be an instance of ApiClient', async () => {
      const { apiClient } = await import('./api');
      expect(apiClient).toBeInstanceOf(ApiClient);
    });

    it('should have correct base URL from Jest config', async () => {
      const { apiClient } = await import('./api');
      const testClient = apiClient as unknown as TestApiClient;
      expect(testClient.baseUrl).toBe('http://localhost:5000/todoitems');
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Test Todo', isComplete: false }] };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const result = await apiClient.get('/');

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
      });
    });

    it('should handle GET request errors', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.get('/nonexistent')).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/')).rejects.toThrow(ApiError);
    });

    it('should handle JSON parsing errors', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.get('/')).rejects.toThrow('Failed to parse response as JSON');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { name: 'New Todo', isComplete: false };
      const mockResponse = { id: 1, ...mockData };
      const mockFetchResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const result = await apiClient.post('/', mockData);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        data: mockResponse,
        status: 201,
        statusText: 'Created',
      });
    });

    it('should handle POST request errors', async () => {
      const mockData = { name: 'New Todo', isComplete: false };
      const mockFetchResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.post('/', mockData)).rejects.toThrow(ApiError);
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockData = { name: 'Updated Todo', isComplete: true };
      const mockResponse = { id: 1, ...mockData };
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const result = await apiClient.put('/1', mockData);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
      });
    });

    it('should handle PUT request errors', async () => {
      const mockData = { name: 'Updated Todo', isComplete: true };
      const mockFetchResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.put('/999', mockData)).rejects.toThrow(ApiError);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 204,
        statusText: 'No Content',
        json: jest.fn().mockResolvedValue(null),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const result = await apiClient.delete('/1');

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/1`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(result).toEqual({
        data: null,
        status: 204,
        statusText: 'No Content',
      });
    });

    it('should handle DELETE request errors', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.delete('/999')).rejects.toThrow(ApiError);
    });
  });

  describe('ApiError', () => {
    it('should create ApiError with correct properties', () => {
      const error = new ApiError('Test error', 500, 'Internal Server Error');

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
      expect(error.name).toBe('ApiError');
    });

    it('should create ApiError without status', () => {
      const error = new ApiError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
      expect(error.name).toBe('ApiError');
    });

    it('should be instance of Error and ApiError', () => {
      const error = new ApiError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('Headers', () => {
    it('should merge custom headers with default headers', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({}),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await (apiClient as unknown as TestApiClient).request('/test', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer token123',
          'Custom-Header': 'custom-value',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
            'Custom-Header': 'custom-value',
          }),
        })
      );
    });

    it('should override default headers with custom headers', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({}),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await (apiClient as unknown as TestApiClient).request('/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/xml',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/xml',
          }),
        })
      );
    });
  });

  describe('URL construction', () => {
    it('should construct full URL correctly', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({}),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await apiClient.get('/todos/1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/todoitems/todos/1',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle empty endpoint', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({}),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await apiClient.get('');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/todoitems',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Request configuration', () => {
    it('should merge request options correctly', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({}),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await (apiClient as unknown as TestApiClient).request('/test', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          'Custom-Header': 'value',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ test: 'data' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Custom-Header': 'value',
          }),
        })
      );
    });
  });

  describe('Error message formatting', () => {
    it('should format HTTP error messages correctly', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      await expect(apiClient.get('/not-found')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('should format network error messages correctly', async () => {
      const networkError = new Error('Network connection failed');
      (fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(apiClient.get('/test')).rejects.toThrow(
        'Network connection failed'
      );
    });

    it('should handle non-Error objects in network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue('string error');

      await expect(apiClient.get('/test')).rejects.toThrow(
        'Network error occurred'
      );
    });
  });

  describe('Generic type parameters', () => {
    it('should handle POST with different data types', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        json: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const testData = { name: 'Test Todo', isComplete: false };
      const result = await apiClient.post<{ id: number; name: string }, typeof testData>('/', testData);

      expect(result.data).toEqual({ id: 1, name: 'Test' });
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testData),
        })
      );
    });

    it('should handle PUT with different data types', async () => {
      const mockFetchResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue({ id: 1, name: 'Updated' }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockFetchResponse as unknown as Response);

      const updateData = { name: 'Updated Todo', isComplete: true };
      const result = await apiClient.put<{ id: number; name: string }, typeof updateData>('/1', updateData);

      expect(result.data).toEqual({ id: 1, name: 'Updated' });
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
    });
  });
});