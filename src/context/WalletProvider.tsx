import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Balance, Transaction, UsdRates } from '../types/wallet'
import { useAuth } from '../hooks/useAuth'
import { HttpError } from '../services/httpClient'
import { walletService } from '../services/walletService'
import { WalletContext, type WalletContextValue, type WalletStatus } from './walletContextValue'

const RECENT_LIMIT = 5

interface WalletState {
    status: WalletStatus
    balances: Balance[]
    usdRates: UsdRates
    change24h: number
    transactions: Transaction[]
    error: string | null
}

const emptyState: WalletState = {
    status: 'idle',
    balances: [],
    usdRates: {},
    change24h: 0,
    transactions: [],
    error: null,
}

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Ocurrió un error inesperado'
}

// Trae saldos, cotizaciones y últimos movimientos. Los movimientos son
// opcionales: si ese pedido falla, el dashboard igual se muestra.
async function fetchWallet() {
    const [summary, transactions] = await Promise.all([
        walletService.getSummary(),
        walletService.getRecentTransactions(RECENT_LIMIT).catch((): Transaction[] => []),
    ])
    return { summary, transactions }
}

// Reemplaza (o agrega) el saldo de una moneda con el valor que devolvió el back.
function upsertBalances(current: Balance[], updates: Balance[]): Balance[] {
    const next = [...current]
    for (const update of updates) {
        const index = next.findIndex((b) => b.currency === update.currency)
        if (index >= 0) next[index] = update
        else next.push(update)
    }
    return next
}

function WalletSession({ children }: { children: ReactNode }) {
    const { status: authStatus, logout } = useAuth()
    const authenticated = authStatus === 'authenticated'

    // Si ya hay sesión al montar, arrancamos en "loading" para no mostrar
    // un instante de pantalla vacía antes de pedir los datos.
    const [state, setState] = useState<WalletState>(() =>
        authenticated ? { ...emptyState, status: 'loading' } : emptyState,
    )

    // Un 401 significa sesión vencida o inválida: la app cierra la sesión.
    const handleError = useCallback(
        (err: unknown) => {
            if (err instanceof HttpError && err.status === 401) void logout()
        },
        [logout],
    )

    // Carga inicial al entrar con sesión.
    useEffect(() => {
        if (!authenticated) return
        let cancelled = false

        fetchWallet()
            .then(({ summary, transactions }) => {
                if (cancelled) return
                setState({
                    status: 'ready',
                    balances: summary.balances,
                    usdRates: summary.usdRates,
                    change24h: summary.change24h,
                    transactions,
                    error: null,
                })
            })
            .catch((err) => {
                if (cancelled) return
                handleError(err)
                setState((s) => ({ ...s, status: 'error', error: getErrorMessage(err) }))
            })

        // Limpieza: ignora la respuesta si el componente se desmonta (o StrictMode
        // lo monta dos veces en desarrollo).
        return () => {
            cancelled = true
        }
    }, [authenticated, handleError])

    // "Reintentar" cuando falló la carga.
    const refresh = useCallback(async () => {
        setState((s) => ({ ...s, status: 'loading', error: null }))
        try {
            const { summary, transactions } = await fetchWallet()
            setState({
                status: 'ready',
                balances: summary.balances,
                usdRates: summary.usdRates,
                change24h: summary.change24h,
                transactions,
                error: null,
            })
        } catch (err) {
            handleError(err)
            setState((s) => ({ ...s, status: 'error', error: getErrorMessage(err) }))
        }
    }, [handleError])

    const deposit = useCallback<WalletContextValue['deposit']>(
        async (currency, amount) => {
            try {
                const result = await walletService.deposit(currency, amount)
                // El back devuelve el saldo nuevo: no hace falta pedir el summary de nuevo.
                setState((s) => ({
                    ...s,
                    balances: upsertBalances(s.balances, [result.balance]),
                    transactions: [result.transaction, ...s.transactions].slice(0, RECENT_LIMIT),
                }))
                return result
            } catch (err) {
                handleError(err)
                throw err
            }
        },
        [handleError],
    )

    const exchange = useCallback<WalletContextValue['exchange']>(
        async (request) => {
            try {
                const result = await walletService.exchange(request)
                setState((s) => ({
                    ...s,
                    balances: upsertBalances(s.balances, result.balances),
                    transactions: [result.transaction, ...s.transactions].slice(0, RECENT_LIMIT),
                }))
                return result
            } catch (err) {
                handleError(err)
                throw err
            }
        },
        [handleError],
    )

    const value = useMemo<WalletContextValue>(
        () => ({ ...state, refresh, deposit, exchange }),
        [state, refresh, deposit, exchange],
    )

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Va debajo de AuthProvider. El `key` por usuario reinicia todo el estado al
// cerrar sesión o cambiar de usuario: nadie ve saldos de otra cuenta.
export function WalletProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    return <WalletSession key={user?.id ?? 'anon'}>{children}</WalletSession>
}
