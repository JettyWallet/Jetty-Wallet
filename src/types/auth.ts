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

// Lo que devuelve el backend en login y registro.
// El token viaja en una cookie httpOnly: el frontend nunca lo ve.
export interface AuthResponse {
    user: User
}

// Contrato que cumplen el servicio mock y el real
export interface AuthService {
    login(credentials: LoginCredentials): Promise<User>
    register(data: RegisterData): Promise<User>
    loginWithGoogle(): Promise<User>
    // Devuelve el usuario de la sesión actual, o null si no hay sesión válida
    getCurrentUser(): Promise<User | null>
    // Cierra la sesión en el servidor (el backend borra la cookie)
    logout(): Promise<void>
}