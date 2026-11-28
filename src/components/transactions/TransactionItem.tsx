import {
    ArrowDownLeft,
    ArrowDownToLine,
    ArrowLeftRight,
    ArrowUpRight,
    type LucideIcon,
} from 'lucide-react'
import type { Transaction, TransactionType } from '../../types/wallet'
import { TRANSACTION_LABEL, formatMoney } from '../../utils/format'
import { formatDateTime } from '../../utils/dateTime'

// Mismos íconos que RecentActivity, para que el dashboard y el historial se vean igual.
const ICONS: Record<TransactionType, LucideIcon> = {
    deposit: ArrowDownToLine,
    exchange: ArrowLeftRight,
    transfer_in: ArrowDownLeft,
    transfer_out: ArrowUpRight,
}

// Una fila del historial. Solo dibuja: no pide datos.
export function TransactionItem({ transaction: t }: { transaction: Transaction }) {
    const Icon = ICONS[t.type]
    const outgoing = t.type === 'transfer_out'
    // El texto del back ("Saldo de bienvenida") tiene prioridad sobre la etiqueta genérica.
    const title = t.description ?? TRANSACTION_LABEL[t.type]

    return (
        <li className="flex items-center gap-3 py-3">
            {/* Color solo como acento, en el fondo del ícono; el texto queda en navy */}
            <span
                aria-hidden="true"
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${outgoing ? 'bg-coral/15' : 'bg-turquoise/15'
                    }`}
            >
                <Icon size={18} />
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{title}</p>
                <p className="text-xs text-navy/70">
                    <time dateTime={t.createdAt}>{formatDateTime(t.createdAt)}</time>
                </p>
            </div>

            <div className="shrink-0 text-right text-sm">
                {t.type === 'exchange' && t.fromAmount !== null && t.fromCurrency && (
                    <p className="text-xs text-navy/70">
                        − {formatMoney(t.fromAmount)} {t.fromCurrency}
                    </p>
                )}
                <p className="font-bold">
                    {outgoing ? '−' : '+'} {formatMoney(t.toAmount)} {t.toCurrency}
                </p>
            </div>
        </li>
    )
}