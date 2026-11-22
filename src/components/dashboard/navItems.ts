import { ArrowLeftRight, History, LayoutGrid, Wallet, type LucideIcon } from 'lucide-react'

export interface NavItem {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
}

// Única fuente del menú: lo usan el sidebar (escritorio) y la barra inferior (celular).
export const NAV_ITEMS: NavItem[] = [
    { to: '/dashboard', label: 'Inicio', icon: LayoutGrid, end: true },
    { to: '/dashboard/wallets', label: 'Monedas', icon: Wallet },
    { to: '/dashboard/exchange', label: 'Operar', icon: ArrowLeftRight },
    { to: '/dashboard/history', label: 'Historial', icon: History },
]
