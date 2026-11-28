import { TransactionItem } from '../components/transactions/TransactionItem'
import { useTransactionHistory } from '../hooks/useTransactionHistory'

const buttonClass =
    'rounded-2xl border border-navy/15 px-4 py-3 text-sm font-semibold transition hover:bg-cream ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ' +
    'disabled:cursor-not-allowed disabled:opacity-60'

// Pantalla de historial: solo dibuja lo que da useTransactionHistory.
export function HistoryPage() {
    const { items, status, loadingMore, hasMore, error, loadMore, retry } = useTransactionHistory()

    return (
        <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Historial</h1>

            <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 sm:p-6">
                {status === 'loading' && (
                    <p role="status" className="py-8 text-center text-sm text-navy/70">
                        Cargando movimientos…
                    </p>
                )}

                {status === 'error' && (
                    <div className="py-8 text-center">
                        <p role="alert" className="rounded-xl bg-coral/10 p-3 text-sm text-navy">
                            No pudimos cargar tus movimientos. {error}
                        </p>
                        <button type="button" onClick={() => void retry()} className={`mt-4 ${buttonClass}`}>
                            Reintentar
                        </button>
                    </div>
                )}

                {status === 'ready' && items.length === 0 && (
                    <p className="py-8 text-center text-sm text-navy/70">Todavía no tenés movimientos.</p>
                )}

                {status === 'ready' && items.length > 0 && (
                    <>
                        <ul className="divide-y divide-navy/5">
                            {items.map((t) => (
                                <TransactionItem key={t.id} transaction={t} />
                            ))}
                        </ul>

                        {/* Error de "Cargar más": los movimientos ya cargados se quedan */}
                        {error && (
                            <p role="alert" className="mt-4 rounded-xl bg-coral/10 p-3 text-sm text-navy">
                                No pudimos cargar más movimientos. {error}
                            </p>
                        )}

                        {hasMore ? (
                            <button
                                type="button"
                                onClick={() => void loadMore()}
                                disabled={loadingMore}
                                className={`mt-4 w-full ${buttonClass}`}
                            >
                                {loadingMore ? 'Cargando…' : 'Cargar más'}
                            </button>
                        ) : (
                            <p className="mt-4 text-center text-xs text-navy/70">
                                Esos son todos tus movimientos.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}