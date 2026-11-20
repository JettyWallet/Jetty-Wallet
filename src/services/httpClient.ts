import { tokenStorage } from './tokenStorage'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class HttpError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'HttpError'
        this.status = status
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    auth?: boolean
}

export async function request<T>(
    path: string,
    { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {}

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json'
    }

    const token = tokenStorage.get()
    if (auth && token) {
        headers.Authorization = `Bearer ${token}`
    }

    let response: Response
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    } catch {
        throw new HttpError(
            'No pudimos conectarnos con el servidor. Revisá tu conexión.',
            0,
        )
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message =
            data && typeof data.message === 'string'
                ? data.message
                : 'Ocurrió un error inesperado. Probá de nuevo.'
        throw new HttpError(message, response.status)
    }

    return data as T
}