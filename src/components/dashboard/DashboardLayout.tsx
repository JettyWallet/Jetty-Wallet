import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BottomNav } from './BottomNav'
import { Logo } from './Logo'
import { Sidebar } from './Sidebar'

// Estructura de todas las pantallas internas:
// Sidebar (escritorio) + contenido + barra inferior (celular).
export function DashboardLayout() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-cream">
            <Sidebar />

            {/* Cabecera solo en celular: en escritorio el logo y el usuario viven en el sidebar */}
            <header className="flex items-center justify-between px-5 pt-5 lg:hidden">
                <Logo />
                <button
                    type="button"
                    onClick={logout}
                    aria-label={`Cerrar sesión de ${user?.name ?? 'tu cuenta'}`}
                    className="grid size-10 place-items-center rounded-full bg-coral font-bold text-navy"
                >
                    {user?.name.charAt(0).toUpperCase()}
                </button>
            </header>

            <main className="px-5 pb-28 pt-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-10">
                <div className="mx-auto max-w-5xl">
                    <Outlet />
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
