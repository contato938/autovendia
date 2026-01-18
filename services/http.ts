// HTTP Client with fallback to fixtures

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : '';
  
  // Se não tem baseUrl, retorna null para services usarem fixtures
  if (!url) {
    throw new Error('NO_API_CONFIGURED');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Request failed: ${response.statusText}`
    );
  }

  return response.json();
}

export const http = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
