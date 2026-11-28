import type { Transaction } from '../types/wallet'

// Estado de la pantalla de historial. Función pura: no llama a servicios.
export interface TransactionHistoryState {
    items: Transaction[]
    // loading: primera página en camino; error: falló la primera página.
    status: 'loading' | 'ready' | 'error'
    // "Cargar más" en curso (los items ya mostrados siguen en pantalla).
    loadingMore: boolean
    // Si la última página vino completa, puede haber más.
    hasMore: boolean
    error: string | null
}

export type TransactionHistoryAction =
    | { type: 'FIRST_PAGE_START' }
    | { type: 'FIRST_PAGE_SUCCESS'; items: Transaction[]; pageSize: number }
    | { type: 'FIRST_PAGE_FAILURE'; error: string }
    | { type: 'MORE_START' }
    | { type: 'MORE_SUCCESS'; items: Transaction[]; pageSize: number }
    | { type: 'MORE_FAILURE'; error: string }

export const initialTransactionHistoryState: TransactionHistoryState = {
    items: [],
    status: 'loading',
    loadingMore: false,
    hasMore: false,
    error: null,
}

export function transactionHistoryReducer(
    state: TransactionHistoryState,
    action: TransactionHistoryAction,
): TransactionHistoryState {
    switch (action.type) {
        case 'FIRST_PAGE_START':
            return initialTransactionHistoryState
        case 'FIRST_PAGE_SUCCESS':
            return {
                items: action.items,
                status: 'ready',
                loadingMore: false,
                // Contrato: si llegan menos que limit, no hay más.
                hasMore: action.items.length === action.pageSize,
                error: null,
            }
        case 'FIRST_PAGE_FAILURE':
            return { ...initialTransactionHistoryState, status: 'error', error: action.error }
        case 'MORE_START':
            return { ...state, loadingMore: true, error: null }
        case 'MORE_SUCCESS':
            return {
                ...state,
                // Los nuevos son más viejos: van al final.
                items: [...state.items, ...action.items],
                loadingMore: false,
                hasMore: action.items.length === action.pageSize,
            }
        case 'MORE_FAILURE':
            // Los movimientos ya cargados se quedan: solo se muestra el error.
            return { ...state, loadingMore: false, error: action.error }
        default:
            return state
    }
}