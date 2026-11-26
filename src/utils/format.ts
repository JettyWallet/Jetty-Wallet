import type { Balance, CurrencyCode, TransactionType, UsdRates } from '../types/wallet'

// Texto que reemplaza a los montos cuando el usuario oculta sus saldos
export const MASK = '••••••'

export const CURRENCIES: Record<CurrencyCode, { name: string; symbol: string; flag: string }> = {
    USD: { name: 'Dólar estadounidense', symbol: '$', flag: '🇺🇸' },
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
    COP: { name: 'Peso colombiano', symbol: '$', flag: '🇨🇴' },
    ARS: { name: 'Peso argentino', symbol: '$', flag: '🇦🇷' },
}

// El backend guarda hasta 2 decimales en todas las monedas: se muestran siempre
// los 2, para no esconder centavos reales (un saldo de 1000,50 no debe verse 1.001).
export function formatMoney(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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
    exchange: 'Intercambio',
    transfer_in: 'Transferencia recibida',
    transfer_out: 'Transferencia enviada',
}

// Cotización de una moneda en USD. USD vale 1 aunque el back no la mande.
function usdRateOf(currency: CurrencyCode, usdRates: UsdRates): number | null {
    const rate = currency === 'USD' ? (usdRates.USD ?? 1) : usdRates[currency]
    return rate && rate > 0 ? rate : null
}

// Total de la billetera en USD: Σ amount × usdRates[currency].
// Devuelve null si falta la cotización de una moneda con saldo: en ese caso
// el total no se puede calcular (los saldos igual se muestran).
export function totalInUsd(balances: Balance[], usdRates: UsdRates): number | null {
    let total = 0
    for (const { currency, amount } of balances) {
        if (amount === 0) continue
        const rate = usdRateOf(currency, usdRates)
        if (rate === null) return null
        total += amount * rate
    }
    return total
}

// Convierte un monto de X a Y: monto × usdRates[X] / usdRates[Y].
// Sirve para el total en otra moneda y para la estimación del intercambio.
export function convertAmount(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    usdRates: UsdRates,
): number | null {
    const rateFrom = usdRateOf(from, usdRates)
    const rateTo = usdRateOf(to, usdRates)
    if (rateFrom === null || rateTo === null) return null
    return (amount * rateFrom) / rateTo
}
