import type { AuthResponse, AuthService, LoginCredentials, RegisterData, User } from '../types/auth'
import { HttpError, request } from './httpClient'

// El token viaja en una cookie httpOnly que setea y borra el backend.
// Este servicio nunca lo guarda ni lo lee.
export const authServiceReal: AuthService = {
    async login(credentials: LoginCredentials) {
        const { user } = await request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: credentials,
        })
        return user
    },

    async register(data: RegisterData) {
        const { user } = await request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: data,
        })
        return user
    },

    async getCurrentUser() {
        try {
            return await request<User>('/me')
        } catch (error) {
            // Sin cookie o sesión vencida: no hay usuario
            if (error instanceof HttpError && error.status === 401) {
                return null
            }
            throw error
        }
    },

    async logout() {
        await request<unknown>('/auth/logout', { method: 'POST' })
    },
}