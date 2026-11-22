import type { Balance } from '../../types/wallet'
import { CURRENCIES, MASK, formatMoney } from '../../utils/format'

const ACCENTS = {
    USD: 'bg-turquoise/15',
    EUR: 'bg-coral/15',
    COP: 'bg-navy/10',
    ARS: 'bg-turquoise/15',
} as const

export function CurrencyCard({ balance, hidden }: { balance: Balance; hidden: boolean }) {
    const meta = CURRENCIES[balance.currency]

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
            <p className="mt-4 text-xl font-bold tracking-tight">
                {meta.symbol} {hidden ? MASK : formatMoney(balance.amount, balance.currency)}
            </p>
        </article>
    )
}
