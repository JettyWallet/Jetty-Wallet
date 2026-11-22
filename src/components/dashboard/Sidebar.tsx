import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from './Logo'
import { NAV_ITEMS } from './navItems'

export function Sidebar() {
    const { user, logout } = useAuth()

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy p-6 text-white lg:flex">
            <Logo light />

            <nav aria-label="Principal" className="mt-10 flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                isActive
                                    ? 'bg-turquoise text-navy'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <Icon size={18} aria-hidden="true" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-coral font-bold text-navy"
                >
                    {user?.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-white/60">{user?.email}</p>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                    className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                    <LogOut size={18} aria-hidden="true" />
                </button>
            </div>
        </aside>
    )
}
