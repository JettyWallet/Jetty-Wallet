import { Link } from 'react-router-dom'
import { ArrowDownToLine, ArrowLeftRight, type LucideIcon } from 'lucide-react'

interface Action {
    label: string
    to: string
    icon: LucideIcon
    style: string
}

// Operaciones que ya existen en el back: depositar e intercambiar.
const ACTIONS: Action[] = [
    { label: 'Depositar', to: '/dashboard/deposit', icon: ArrowDownToLine, style: 'bg-turquoise text-navy' },
    { label: 'Intercambiar', to: '/dashboard/exchange', icon: ArrowLeftRight, style: 'bg-navy text-white' },
]

export function QuickActions() {
    return (
        <section aria-label="Acciones rápidas" className="grid grid-cols-2 gap-3">
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
