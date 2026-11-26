import type { Balance, UsdRates } from '../../types/wallet'
import { CURRENCIES, MASK, convertAmount, formatMoney } from '../../utils/format'

const ACCENTS = {
    USD: 'bg-turquoise/15',
    EUR: 'bg-coral/15',
    COP: 'bg-navy/10',
    ARS: 'bg-turquoise/15',
} as const

interface CurrencyCardProps {
    balance: Balance
    usdRates: UsdRates
    hidden: boolean
}

export function CurrencyCard({ balance, usdRates, hidden }: CurrencyCardProps) {
    const meta = CURRENCIES[balance.currency]

    // Equivalente en USD (solo en monedas distintas de USD y si hay cotización)
    const inUsd =
        balance.currency === 'USD'
            ? null
            : convertAmount(balance.amount, balance.currency, 'USD', usdRates)

    return (
        <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className={`grid size-10 place-items-center rounded-xl text-xl ${ACCENTS[balance.currency]}`}
                >
                    {meta.flag}
                </span>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold">{balance.currency}</h3>
                    <p className="truncate text-xs text-navy/60">{meta.name}</p>
                </div>
            </div>
            <p className="mt-4 break-words text-xl font-bold tracking-tight">
                {meta.symbol} {hidden ? MASK : formatMoney(balance.amount)}
            </p>
            {inUsd !== null && (
                <p className="mt-1 text-xs text-navy/60">≈ US$ {hidden ? MASK : formatMoney(inUsd)}</p>
            )}
        </article>
    )
}
