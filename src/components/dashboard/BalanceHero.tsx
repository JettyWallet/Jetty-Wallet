import { Eye, EyeOff, TrendingDown, TrendingUp } from 'lucide-react'
import type { WalletSummary } from '../../types/wallet'
import { MASK, formatMoney, totalInUsd } from '../../utils/format'

interface BalanceHeroProps {
    summary: WalletSummary
    hidden: boolean
    onToggleHidden: () => void
}

export function BalanceHero({ summary, hidden, onToggleHidden }: BalanceHeroProps) {
    const positive = summary.change24h >= 0
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
                <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                        Balance total estimado
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-turquoise">
                            Fondos simulados
                        </span>
                    </div>

                    <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        $ {hidden ? MASK : formatMoney(totalInUsd(summary), 'USD')}{' '}
                        <span className="text-lg font-semibold text-white/60">USD</span>
                    </p>

                    <p
                        className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            positive ? 'bg-turquoise/20 text-turquoise' : 'bg-coral/20 text-coral'
                        }`}
                    >
                        <TrendIcon size={14} aria-hidden="true" />
                        {positive ? '+' : ''}
                        {summary.change24h.toFixed(1)}% en 24 h
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onToggleHidden}
                    aria-label={hidden ? 'Mostrar saldos' : 'Ocultar saldos'}
                    aria-pressed={hidden}
                    className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                >
                    {hidden ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
            </div>
        </section>
    )
}
