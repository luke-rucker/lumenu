/**
 * HTTP client abstraction for dependency injection and testing
 */

export interface HttpResponse<T = unknown> {
  ok: boolean
  status: number
  data: T
}

/**
 * Injectable HTTP client interface for making requests
 */
export interface HttpClient {
  get<T>(url: string): Promise<HttpResponse<T>>
  put<T>(url: string, body: unknown): Promise<HttpResponse<T>>
  post<T>(url: string, body?: unknown): Promise<HttpResponse<T>>
}

/**
 * Default HTTP client implementation using native fetch
 */
export class FetchHttpClient implements HttpClient {
  async get<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    const data = response.ok ? ((await response.json()) as T) : (null as T)

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  }

  async put<T>(url: string, body: unknown): Promise<HttpResponse<T>> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = response.ok ? ((await response.json()) as T) : (null as T)

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  }

  async post<T>(url: string, body?: unknown): Promise<HttpResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })

    const data =
      response.ok && response.status !== 204
        ? ((await response.json()) as T)
        : (null as T)

    return {
      ok: response.ok,
      status: response.status,
      data,
    }
  }
}
