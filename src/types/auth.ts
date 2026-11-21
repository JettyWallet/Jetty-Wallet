export interface User {
    id: string
    name: string
    email: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}

// Lo que asumimos que devuelve el backend en login y registro
export interface AuthResponse {
    token: string
    user: User
}

// Contrato que cumplen el servicio mock y el real
export interface AuthService {
    login(credentials: LoginCredentials): Promise<User>
    register(data: RegisterData): Promise<User>
    loginWithGoogle(): Promise<User>
    // Devuelve el usuario de la sesión guardada, o null si no hay sesión válida
    getCurrentUser(): Promise<User | null>
    logout(): void
}