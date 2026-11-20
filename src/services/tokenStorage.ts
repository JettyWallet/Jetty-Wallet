const TOKEN_KEY = 'jetty_token'

export const tokenStorage = {
    get(): string | null {
        try {
            return localStorage.getItem(TOKEN_KEY)
        } catch {
            return null
        }
    },
    set(token: string): void {
        try {
            localStorage.setItem(TOKEN_KEY, token)
        } catch {
            // Si el navegador bloquea el storage, la sesión no persiste, pero la app no se rompe
        }
    },
    clear(): void {
        try {
            localStorage.removeItem(TOKEN_KEY)
        } catch {
            // idem
        }
    },
}