import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

export function BottomNav() {
    return (
        <nav
            aria-label="Principal"
            className="fixed inset-x-0 bottom-0 z-20 flex border-t border-navy/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                        `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
                            isActive ? 'text-navy' : 'text-navy/50'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className={`grid h-7 w-12 place-items-center rounded-full transition ${
                                    isActive ? 'bg-turquoise' : ''
                                }`}
                            >
                                <Icon size={18} aria-hidden="true" />
                            </span>
                            {label}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    )
}
