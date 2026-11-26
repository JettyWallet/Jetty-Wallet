import type { User } from '../types/auth'

export type AuthStatus =
    | 'initializing' // leyendo la sesión guardada al abrir la app
    | 'unauthenticated' // sin sesión
    | 'authenticating' // login o registro en curso
    | 'authenticated' // con sesión

export interface AuthState {
    user: User | null
    status: AuthStatus
    error: string | null // error para mostrar (credenciales incorrectas, sin conexión...)
    notice: string | null // aviso informativo, no es un error (ej. sesión vencida)
}

export type AuthAction =
    | { type: 'INIT_DONE'; user: User | null }
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; user: User }
    | { type: 'AUTH_FAILURE'; error: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SESSION_EXPIRED' }

export const initialAuthState: AuthState = {
    user: null,
    status: 'initializing',
    error: null,
    notice: null,
}

export const SESSION_EXPIRED_MESSAGE = 'Tu sesión venció. Iniciá sesión de nuevo.'

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'INIT_DONE':
            return {
                user: action.user,
                status: action.user ? 'authenticated' : 'unauthenticated',
                error: null,
                notice: null,
            }
        case 'AUTH_START':
            // Al reintentar el login, el aviso anterior ya cumplió su función.
            return { ...state, status: 'authenticating', error: null, notice: null }
        case 'AUTH_SUCCESS':
            return { user: action.user, status: 'authenticated', error: null, notice: null }
        case 'AUTH_FAILURE':
            return { user: null, status: 'unauthenticated', error: action.error, notice: null }
        case 'LOGOUT':
            return { user: null, status: 'unauthenticated', error: null, notice: null }
        case 'CLEAR_ERROR':
            // Solo limpia el error: el aviso de sesión vencida tiene que
            // sobrevivir al clearError que hace LoginPage al montarse.
            return { ...state, error: null }
        case 'SESSION_EXPIRED':
            // Un 401 solo significa "sesión vencida" si el usuario estaba logueado.
            // Al arrancar (initializing) o durante un login fallido (authenticating)
            // el 401 tiene otro significado y no debe pisar ese estado.
            if (state.status !== 'authenticated') return state
            return {
                user: null,
                status: 'unauthenticated',
                error: null,
                notice: SESSION_EXPIRED_MESSAGE,
            }
        default:
            return state
    }
}