import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { walletService } from '../../services/walletService'
import { CURRENCY_CODES, type CurrencyCode } from '../../types/wallet'
import { buildQuote, formatQuote, timeAgo } from '../../utils/format'

interface RatesBarProps {
    // Moneda elegida para el total: las cotizaciones se muestran contra ella
    reference: CurrencyCode
}

// Franja fija (sin animación: son solo 3 cotizaciones, así no hay nada que pausar
// ni que adaptar a prefers-reduced-motion). Sin flechas de sube/baja: el back no
// tiene historial de cotizaciones y no se inventa una tendencia.
export function RatesBar({ reference }: RatesBarProps) {
    const rates = useAsync(walletService.getRates)
    // Para que "hace X min" se mantenga al día sin recargar
    const [now, setNow] = useState(() => new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(id)
    }, [])

    if (rates.loading) {
        return (
            <div aria-hidden="true" className="h-10 animate-pulse rounded-2xl bg-navy/5" />
        )
    }

    if (rates.error || !rates.data) {
        return (
            <p role="status" className="rounded-2xl bg-navy/5 px-4 py-2 text-xs text-navy/60">
                Las cotizaciones no están disponibles en este momento.
            </p>
        )
    }

    const quotes = CURRENCY_CODES.filter((code) => code !== reference)
        .map((code) => buildQuote(code, reference, rates.data?.usdRates ?? {}))
        .filter((q) => q !== null)

    if (quotes.length === 0) return null

    return (
        <section
            aria-label="Cotizaciones del día"
            className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-2.5 text-xs shadow-sm ring-1 ring-navy/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
            <ul className="flex flex-wrap gap-x-5 gap-y-1 font-semibold">
                {quotes.map((q) => (
                    <li key={q.from}>{formatQuote(q)}</li>
                ))}
            </ul>
            <p className="flex items-center gap-1.5 text-navy/60">
                {rates.data.stale && <AlertTriangle size={14} className="text-coral" aria-hidden="true" />}
                {rates.data.stale ? 'Puede estar desactualizado · ' : ''}
                Actualizado {timeAgo(rates.data.updatedAt, now)}
            </p>
        </section>
    )
}
