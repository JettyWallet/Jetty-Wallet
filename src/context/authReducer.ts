import type { User } from '../types/auth'

export type AuthStatus =
    | 'initializing' // leyendo la sesión guardada al abrir la app
    | 'unauthenticated' // sin sesión
    | 'authenticating' // login o registro en curso
    | 'authenticated' // con sesión

export interface AuthState {
    user: User | null
    status: AuthStatus
    error: string | null
}

export type AuthAction =
    | { type: 'INIT_DONE'; user: User | null }
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; user: User }
    | { type: 'AUTH_FAILURE'; error: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }

export const initialAuthState: AuthState = {
    user: null,
    status: 'initializing',
    error: null,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'INIT_DONE':
            return {
                user: action.user,
                status: action.user ? 'authenticated' : 'unauthenticated',
                error: null,
            }
        case 'AUTH_START':
            return { ...state, status: 'authenticating', error: null }
        case 'AUTH_SUCCESS':
            return { user: action.user, status: 'authenticated', error: null }
        case 'AUTH_FAILURE':
            return { user: null, status: 'unauthenticated', error: action.error }
        case 'LOGOUT':
            return { user: null, status: 'unauthenticated', error: null }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}