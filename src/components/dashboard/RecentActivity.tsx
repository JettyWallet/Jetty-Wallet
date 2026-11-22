import { Link } from 'react-router-dom'
import { ArrowDownToLine, ArrowLeftRight, ChevronRight, ShoppingCart, Tag, type LucideIcon } from 'lucide-react'
import type { Transaction, TransactionType } from '../../types/wallet'
import { MASK, TRANSACTION_LABEL, formatDate, formatMoney } from '../../utils/format'

const ICONS: Record<TransactionType, LucideIcon> = {
    deposit: ArrowDownToLine,
    buy: ShoppingCart,
    sell: Tag,
    exchange: ArrowLeftRight,
}

export function RecentActivity({ items, hidden }: { items: Transaction[]; hidden: boolean }) {
    return (
        <section aria-labelledby="recent-title" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 id="recent-title" className="text-lg font-bold">
                    Últimos movimientos
                </h2>
                <Link
                    to="/dashboard/history"
                    className="inline-flex items-center text-sm font-semibold text-turquoise hover:underline"
                >
                    Ver todos <ChevronRight size={16} aria-hidden="true" />
                </Link>
            </div>

            {items.length === 0 ? (
                <p className="py-8 text-center text-sm text-navy/60">Todavía no tenés movimientos.</p>
            ) : (
                <ul className="divide-y divide-navy/5">
                    {items.map((t) => {
                        const Icon = ICONS[t.type]
                        return (
                            <li key={t.id} className="flex items-center gap-3 py-3">
                                <span
                                    aria-hidden="true"
                                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream"
                                >
                                    <Icon size={18} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold">{TRANSACTION_LABEL[t.type]}</p>
                                    <p className="text-xs text-navy/60">{formatDate(t.createdAt)}</p>
                                </div>
                                <div className="text-right text-sm">
                                    {t.fromAmount !== null && t.fromCurrency && (
                                        <p className="text-xs text-navy/50">
                                            − {hidden ? MASK : formatMoney(t.fromAmount, t.fromCurrency)} {t.fromCurrency}
                                        </p>
                                    )}
                                    <p className="font-bold text-turquoise">
                                        + {hidden ? MASK : formatMoney(t.toAmount, t.toCurrency)} {t.toCurrency}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}
