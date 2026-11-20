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