import type { AuthResponse, AuthService, LoginCredentials, RegisterData, User } from '../types/auth'
import { HttpError, request } from './httpClient'
import { tokenStorage } from './tokenStorage'

export const authServiceReal: AuthService = {
    async login(credentials: LoginCredentials) {
        const { token, user } = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: credentials,
            auth: false,
        })
        tokenStorage.set(token)
        return user
    },

    async register(data: RegisterData) {
        const { token, user } = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: data,
            auth: false,
        })
        tokenStorage.set(token)
        return user
    },

    async loginWithGoogle() {
        // Pendiente: depende de que el backend soporte POST /auth/google
        // y de tener el Client ID de Google. Se implementa cuando el equipo lo confirme.
        throw new HttpError('El ingreso con Google todavía no está disponible.', 501)
    },

    async getCurrentUser() {
        if (!tokenStorage.get()) return null
        try {
            return await request<User>('/me')
        } catch (error) {
            // Token vencido o inválido: se limpia la sesión guardada
            if (error instanceof HttpError && error.status === 401) {
                tokenStorage.clear()
                return null
            }
            throw error
        }
    },

    logout() {
        tokenStorage.clear()
    },
}