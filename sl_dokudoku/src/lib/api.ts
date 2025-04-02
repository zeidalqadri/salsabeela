type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new ApiError(
      data.error || 'An error occurred',
      response.status,
      data
    )
  }

  return data
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
  } = options

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    return handleResponse(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      'Network error',
      0,
      error
    )
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
} 