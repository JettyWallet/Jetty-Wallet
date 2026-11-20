import type { AuthService, LoginCredentials, RegisterData, User } from '../types/auth'
import { HttpError } from './httpClient'
import { tokenStorage } from './tokenStorage'

const USERS_KEY = 'jetty_mock_users'
const DELAY_MS = 800
const TOKEN_PREFIX = 'mock-token-'

interface MockUser extends User {
    password: string
}

// Usuario de prueba: demo@jetty.com / 12345678
const seedUsers: MockUser[] = [
    { id: '1', name: 'Usuario Demo', email: 'demo@jetty.com', password: '12345678' },
]

function readUsers(): MockUser[] {
    try {
        const raw = localStorage.getItem(USERS_KEY)
        return raw ? (JSON.parse(raw) as MockUser[]) : seedUsers
    } catch {
        return seedUsers
    }
}

function saveUsers(users: MockUser[]): void {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch {
        // Si el storage no está disponible, los usuarios de prueba no persisten
    }
}

// Espera artificial para poder ver los estados de carga
const wait = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

// Nunca devolvemos la contraseña hacia afuera
const toUser = ({ id, name, email }: MockUser): User => ({ id, name, email })

function startSession(user: MockUser): User {
    tokenStorage.set(`${TOKEN_PREFIX}${user.id}`)
    return toUser(user)
}

export const authServiceMock: AuthService = {
    async login({ email, password }: LoginCredentials) {
        await wait()
        const user = readUsers().find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        )
        if (!user) throw new HttpError('Correo o contraseña incorrectos.', 401)
        return startSession(user)
    },

    async register({ name, email, password }: RegisterData) {
        await wait()
        const users = readUsers()
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            throw new HttpError('Ya existe una cuenta con ese correo.', 409)
        }
        const newUser: MockUser = { id: crypto.randomUUID(), name, email, password }
        saveUsers([...users, newUser])
        return startSession(newUser)
    },

    async loginWithGoogle() {
        await wait()
        const users = readUsers()
        let user = users.find((u) => u.email === 'google@jetty.com')
        if (!user) {
            user = { id: crypto.randomUUID(), name: 'Usuario Google', email: 'google@jetty.com', password: '' }
            saveUsers([...users, user])
        }
        return startSession(user)
    },

    async getCurrentUser() {
        const token = tokenStorage.get()
        if (!token || !token.startsWith(TOKEN_PREFIX)) return null
        await wait(200)
        const id = token.slice(TOKEN_PREFIX.length)
        const user = readUsers().find((u) => u.id === id)
        if (!user) {
            tokenStorage.clear()
            return null
        }
        return toUser(user)
    },

    logout() {
        tokenStorage.clear()
    },
}