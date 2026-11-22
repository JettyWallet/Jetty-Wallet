import type { CurrencyCode, TransactionType, WalletSummary } from '../types/wallet'

// Texto que reemplaza a los montos cuando el usuario oculta sus saldos
export const MASK = '••••••'

export function totalInUsd(summary: WalletSummary): number {
    return summary.balances.reduce((sum, b) => sum + b.amount * summary.usdRates[b.currency], 0)
}

export const CURRENCIES: Record<CurrencyCode, { name: string; symbol: string; flag: string; decimals: number }> = {
    USD: { name: 'Dólar estadounidense', symbol: '$', flag: '🇺🇸', decimals: 2 },
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
    COP: { name: 'Peso colombiano', symbol: '$', flag: '🇨🇴', decimals: 0 },
    ARS: { name: 'Peso argentino', symbol: '$', flag: '🇦🇷', decimals: 0 },
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
    const { decimals } = CURRENCIES[currency]
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount)
}

export function formatDate(iso: string): string {
    const date = new Date(iso)
    const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000)
    const time = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    if (diffDays <= 0) return `Hoy, ${time}`
    if (diffDays === 1) return `Ayer, ${time}`
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

export const TRANSACTION_LABEL: Record<TransactionType, string> = {
    deposit: 'Depósito',
    buy: 'Compra',
    sell: 'Venta',
    exchange: 'Intercambio',
}
