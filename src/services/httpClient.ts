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
}

// Aviso de "no autorizado": cuando la API responde 401, httpClient avisa a
// quien se haya anotado (por ejemplo, el contexto de auth para cerrar la
// sesión). Este archivo no sabe quién escucha ni qué hace con el aviso:
// así la capa de servicios no conoce React.
type UnauthorizedListener = () => void

const unauthorizedListeners = new Set<UnauthorizedListener>()

// Anota una función para que se ejecute ante cada 401.
// Devuelve otra función que la desanota (para limpiar en un useEffect).
export function onUnauthorized(listener: UnauthorizedListener): () => void {
    unauthorizedListeners.add(listener)
    return () => {
        unauthorizedListeners.delete(listener)
    }
}

export async function request<T>(
    path: string,
    { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {}

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json'
    }

    let response: Response
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            // Manda y recibe la cookie httpOnly de sesión
            credentials: 'include',
        })
    } catch {
        throw new HttpError(
            'No pudimos conectarnos con el servidor. Revisá tu conexión.',
            0,
        )
    }

    // Si la respuesta no tiene cuerpo (ej. 204), data queda en null
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        // Sesión ausente, inválida o vencida: avisamos a los anotados.
        // Igual lanzamos el error abajo, para que quien llamó lo maneje.
        if (response.status === 401) {
            unauthorizedListeners.forEach((listener) => listener())
        }

        const message =
            data && typeof data.message === 'string'
                ? data.message
                : 'Ocurrió un error inesperado. Probá de nuevo.'
        throw new HttpError(message, response.status)
    }

    return data as T
}