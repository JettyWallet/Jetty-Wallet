import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { LoginCredentials, RegisterData, User } from '../types/auth'
import { authService } from '../services/authService'
import { authReducer, initialAuthState } from './authReducer'
import { AuthContext, type AuthContextValue } from './authContextValue'

// Convierte cualquier cosa que se lance en un mensaje legible para la UI.
function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Ocurrió un error inesperado'
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialAuthState)

    // Al arrancar la app: recuperar la sesión guardada (si hay token válido).
    useEffect(() => {
        let cancelled = false

        authService
            .getCurrentUser()
            .then((user) => {
                if (!cancelled) dispatch({ type: 'INIT_DONE', user })
            })
            .catch(() => {
                // Si falla la verificación, tratamos la sesión como inexistente.
                if (!cancelled) dispatch({ type: 'INIT_DONE', user: null })
            })

        // Limpieza: si el componente se desmonta antes de que responda
        // (o StrictMode lo monta dos veces en desarrollo), ignoramos el resultado.
        return () => {
            cancelled = true
        }
    }, [])

    // Lógica común de login / register / google:
    // avisa que empezó, ejecuta la llamada, y despacha éxito o fallo.
    // NO relanza el error: queda en state.error para que la UI lo muestre.
    const runAuth = useCallback(async (action: () => Promise<User>) => {
        dispatch({ type: 'AUTH_START' })
        try {
            const user = await action()
            dispatch({ type: 'AUTH_SUCCESS', user })
        } catch (err) {
            dispatch({ type: 'AUTH_FAILURE', error: getErrorMessage(err) })
        }
    }, [])

    const login = useCallback(
        (credentials: LoginCredentials) => runAuth(() => authService.login(credentials)),
        [runAuth],
    )

    const register = useCallback(
        (data: RegisterData) => runAuth(() => authService.register(data)),
        [runAuth],
    )

    const loginWithGoogle = useCallback(
        () => runAuth(() => authService.loginWithGoogle()),
        [runAuth],
    )

    const logout = useCallback(() => {
        authService.logout() // el servicio borra el token
        dispatch({ type: 'LOGOUT' })
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    // useMemo: el objeto solo se recrea si cambia el estado,
    // así no re-renderizamos a todos los consumidores de más.
    const value = useMemo<AuthContextValue>(
        () => ({
            status: state.status,
            user: state.user,
            error: state.error,
            login,
            register,
            loginWithGoogle,
            logout,
            clearError,
        }),
        [state, login, register, loginWithGoogle, logout, clearError],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}