import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
    const { status } = useAuth()
    const location = useLocation()

    // Todavía estamos leyendo la sesión guardada: no decidimos nada aún.
    // Si redirigiéramos ahora, un usuario con sesión válida iría a /login
    // por un instante cada vez que recarga la página.
    if (status === 'initializing') {
        return (
            <div
                role="status"
                aria-live="polite"
                className="flex min-h-screen items-center justify-center bg-cream text-navy"
            >
                Cargando...
            </div>
        )
    }

    if (status === 'unauthenticated') {
        // replace: el /dashboard no queda en el historial del navegador.
        // state.from: guarda a dónde quería ir, para volver después del login.
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    // 'authenticated' o 'authenticating': hay sesión, se muestra la ruta hija.
    return <Outlet />
}