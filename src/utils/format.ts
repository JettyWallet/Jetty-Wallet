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

// Inicio del día en hora local: "hoy" y "ayer" se miden por día de calendario,
// no por 24 h corridas (algo de las 23:00 de ayer visto a las 08:00 es "Ayer", no "Hoy").
function startOfDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function formatDate(iso: string, now: Date = new Date()): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '—'
    // round absorbe el cambio de horario (días de 23 o 25 h)
    const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)
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

export interface Quote {
    from: CurrencyCode
    // Cuántas unidades de `from` se muestran (1, o 1.000 si 1 unidad vale menos de 0,01)
    units: number
    value: number
    to: CurrencyCode
}

// Cotización de 1 unidad de `from` en la moneda de referencia `to`.
// Si 1 unidad vale menos de 0,01, se muestra por mil ("1.000 COP = 0,26 USD")
// para no mostrar "0,00". Devuelve null si falta alguna cotización.
export function buildQuote(from: CurrencyCode, to: CurrencyCode, usdRates: UsdRates): Quote | null {
    const one = convertAmount(1, from, to, usdRates)
    if (one === null) return null
    if (one < 0.01) return { from, units: 1000, value: one * 1000, to }
    return { from, units: 1, value: one, to }
}

export function formatQuote({ from, units, value, to }: Quote): string {
    const unitsText = new Intl.NumberFormat('es-CO').format(units)
    return `${unitsText} ${from} = ${formatMoney(value)} ${to}`
}

// "hace 5 min" para el aviso de última actualización de las cotizaciones
export function timeAgo(iso: string, now: Date = new Date()): string {
    const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000)
    if (Number.isNaN(minutes)) return ''
    if (minutes < 1) return 'hace menos de 1 min'
    if (minutes < 60) return `hace ${minutes} min`
    const hours = Math.floor(minutes / 60)
    return hours === 1 ? 'hace 1 hora' : `hace ${hours} horas`
}
