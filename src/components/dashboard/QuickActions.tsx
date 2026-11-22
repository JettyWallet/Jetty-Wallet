import { Link } from 'react-router-dom'
import { ArrowDownToLine, ArrowLeftRight, ShoppingCart, Tag, type LucideIcon } from 'lucide-react'

interface Action {
    label: string
    to: string
    icon: LucideIcon
    style: string
}

const ACTIONS: Action[] = [
    { label: 'Depositar', to: '/dashboard/exchange?op=deposit', icon: ArrowDownToLine, style: 'bg-navy text-white' },
    { label: 'Comprar', to: '/dashboard/exchange?op=buy', icon: ShoppingCart, style: 'bg-turquoise text-navy' },
    { label: 'Vender', to: '/dashboard/exchange?op=sell', icon: Tag, style: 'bg-coral text-navy' },
    { label: 'Intercambiar', to: '/dashboard/exchange?op=exchange', icon: ArrowLeftRight, style: 'bg-white text-navy ring-1 ring-navy/10' },
]

export function QuickActions() {
    return (
        <section aria-label="Acciones rápidas" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACTIONS.map(({ label, to, icon: Icon, style }) => (
                <Link
                    key={label}
                    to={to}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${style}`}
                >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                </Link>
            ))}
        </section>
    )
}
