import { useCallback, useEffect, useReducer } from 'react'
import { transactionService } from '../services/transactionService'
import {
    initialTransactionHistoryState,
    transactionHistoryReducer,
} from './transactionHistoryReducer'

// Movimientos por pedido (el back acepta de 1 a 100).
const PAGE_SIZE = 20

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Ocurrió un error inesperado'
}

// Historial completo con "Cargar más". Es la única capa que habla con
// transactionService: la pantalla solo usa lo que devuelve este hook.
// El 401 no se maneja acá: httpClient avisa y AuthProvider cierra la sesión.
export function useTransactionHistory() {
    const [state, dispatch] = useReducer(transactionHistoryReducer, initialTransactionHistoryState)

    // Primera página al abrir la pantalla. El estado inicial ya es "loading",
    // así que acá solo se despacha cuando llega la respuesta.
    useEffect(() => {
        let cancelled = false

        transactionService
            .getTransactions({ limit: PAGE_SIZE })
            .then((items) => {
                if (!cancelled) dispatch({ type: 'FIRST_PAGE_SUCCESS', items, pageSize: PAGE_SIZE })
            })
            .catch((err) => {
                if (!cancelled) dispatch({ type: 'FIRST_PAGE_FAILURE', error: getErrorMessage(err) })
            })

        // Si la pantalla se cierra antes de que responda (o StrictMode la
        // monta dos veces en desarrollo), se ignora el resultado.
        return () => {
            cancelled = true
        }
    }, [])

    // "Reintentar" cuando falló la primera página.
    const retry = useCallback(async () => {
        dispatch({ type: 'FIRST_PAGE_START' })
        try {
            const items = await transactionService.getTransactions({ limit: PAGE_SIZE })
            dispatch({ type: 'FIRST_PAGE_SUCCESS', items, pageSize: PAGE_SIZE })
        } catch (err) {
            dispatch({ type: 'FIRST_PAGE_FAILURE', error: getErrorMessage(err) })
        }
    }, [])

    // "Cargar más": pide los anteriores al último movimiento que ya tenemos.
    const { items, loadingMore, hasMore } = state
    const loadMore = useCallback(async () => {
        const last = items.at(-1)
        if (loadingMore || !hasMore || !last) return

        dispatch({ type: 'MORE_START' })
        try {
            const next = await transactionService.getTransactions({ limit: PAGE_SIZE, before: last.id })
            dispatch({ type: 'MORE_SUCCESS', items: next, pageSize: PAGE_SIZE })
        } catch (err) {
            dispatch({ type: 'MORE_FAILURE', error: getErrorMessage(err) })
        }
    }, [items, loadingMore, hasMore])

    return { ...state, loadMore, retry }
}