import { createContext } from 'react'
import type { LoginCredentials, RegisterData, User } from '../types/auth'
import type { AuthState } from './authReducer'

export interface AuthContextValue {
    // Estado (viene del reducer)
    status: AuthState['status']
    user: User | null
    error: string | null

    // Acciones (las implementa AuthProvider)
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => void
    clearError: () => void
}

// undefined como valor por defecto: así useAuth() puede detectar
// que se lo usó fuera del Provider y tirar un error claro.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)