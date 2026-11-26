import { Eye, EyeOff, TrendingDown, TrendingUp } from 'lucide-react'
import { CURRENCY_CODES, type Balance, type CurrencyCode, type UsdRates } from '../../types/wallet'
import { CURRENCIES, MASK, convertAmount, formatMoney, totalInUsd } from '../../utils/format'

interface BalanceHeroProps {
    balances: Balance[]
    usdRates: UsdRates
    change24h: number
    hidden: boolean
    onToggleHidden: () => void
    displayCurrency: CurrencyCode
    onChangeCurrency: (currency: CurrencyCode) => void
}

export function BalanceHero({
    balances,
    usdRates,
    change24h,
    hidden,
    onToggleHidden,
    displayCurrency,
    onChangeCurrency,
}: BalanceHeroProps) {
    // Total en USD y, desde ahí, en la moneda que eligió el usuario.
    // Si falta alguna cotización, el total no se puede calcular (null).
    const usdTotal = totalInUsd(balances, usdRates)
    const total =
        usdTotal === null ? null : convertAmount(usdTotal, 'USD', displayCurrency, usdRates)

    // El back devuelve 0 hasta que haya historial de cotizaciones: no se muestra un 0% inventado.
    const showChange = change24h !== 0
    const positive = change24h >= 0
    const TrendIcon = positive ? TrendingUp : TrendingDown

    return (
        <section
            aria-label="Balance total"
            className="relative overflow-hidden rounded-3xl bg-navy p-6 text-white shadow-lg shadow-navy/20 sm:p-8"
        >
            {/* Decoración: luces de la paleta */}
            <span aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full bg-turquoise/30 blur-2xl" />
            <span aria-hidden="true" className="absolute -bottom-20 right-24 size-48 rounded-full bg-coral/20 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                        Balance total estimado
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-turquoise">
                            Fondos simulados
                        </span>
                    </div>

                    {total === null ? (
                        <>
                            <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">—</p>
                            <p className="mt-2 text-sm text-white/70">
                                No hay cotizaciones para calcular el total. Tus saldos se ven abajo.
                            </p>
                        </>
                    ) : (
                        <p className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">
                            {CURRENCIES[displayCurrency].symbol} {hidden ? MASK : formatMoney(total)}{' '}
                            <span className="text-lg font-semibold text-white/60">{displayCurrency}</span>
                        </p>
                    )}

                    {showChange && (
                        <p
                            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                positive ? 'bg-turquoise/20 text-turquoise' : 'bg-coral/20 text-coral'
                            }`}
                        >
                            <TrendIcon size={14} aria-hidden="true" />
                            {positive ? '+' : ''}
                            {change24h.toFixed(1)}% en 24 h
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onToggleHidden}
                    aria-label={hidden ? 'Mostrar saldos' : 'Ocultar saldos'}
                    aria-pressed={hidden}
                    className="shrink-0 rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                >
                    {hidden ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
            </div>

            {/* Selector de moneda del total */}
            <div role="group" aria-label="Ver el total en" className="relative mt-6 flex flex-wrap gap-2">
                {CURRENCY_CODES.map((code) => {
                    const active = code === displayCurrency
                    return (
                        <button
                            key={code}
                            type="button"
                            onClick={() => onChangeCurrency(code)}
                            aria-pressed={active}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                                active
                                    ? 'bg-turquoise text-navy'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                        >
                            {code}
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
