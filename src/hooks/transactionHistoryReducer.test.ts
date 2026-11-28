import { describe, expect, it } from 'vitest'
import type { Transaction } from '../types/wallet'
import {
    initialTransactionHistoryState,
    transactionHistoryReducer,
    type TransactionHistoryState,
} from './transactionHistoryReducer'

function makeTransaction(id: string): Transaction {
    return {
        id,
        type: 'deposit',
        fromCurrency: null,
        toCurrency: 'USD',
        fromAmount: null,
        toAmount: 100,
        description: 'Depósito',
        createdAt: '2026-11-28T12:00:00.000Z',
    }
}

const readyState: TransactionHistoryState = {
    items: [makeTransaction('a'), makeTransaction('b')],
    status: 'ready',
    loadingMore: false,
    hasMore: true,
    error: null,
}

describe('transactionHistoryReducer', () => {
    it('arranca cargando la primera página', () => {
        expect(initialTransactionHistoryState.status).toBe('loading')
        expect(initialTransactionHistoryState.items).toEqual([])
    })

    it('con una página completa indica que puede haber más', () => {
        const items = [makeTransaction('a'), makeTransaction('b')]
        const state = transactionHistoryReducer(initialTransactionHistoryState, {
            type: 'FIRST_PAGE_SUCCESS',
            items,
            pageSize: 2,
        })
        expect(state.status).toBe('ready')
        expect(state.items).toEqual(items)
        expect(state.hasMore).toBe(true)
    })

    it('con una página incompleta indica que no hay más', () => {
        const state = transactionHistoryReducer(initialTransactionHistoryState, {
            type: 'FIRST_PAGE_SUCCESS',
            items: [makeTransaction('a')],
            pageSize: 20,
        })
        expect(state.hasMore).toBe(false)
    })

    it('si falla la primera página queda en error', () => {
        const state = transactionHistoryReducer(initialTransactionHistoryState, {
            type: 'FIRST_PAGE_FAILURE',
            error: 'Sin conexión',
        })
        expect(state.status).toBe('error')
        expect(state.error).toBe('Sin conexión')
    })

    it('"Cargar más" agrega los movimientos al final', () => {
        const loading = transactionHistoryReducer(readyState, { type: 'MORE_START' })
        expect(loading.loadingMore).toBe(true)

        const state = transactionHistoryReducer(loading, {
            type: 'MORE_SUCCESS',
            items: [makeTransaction('c')],
            pageSize: 2,
        })
        expect(state.items.map((t) => t.id)).toEqual(['a', 'b', 'c'])
        expect(state.loadingMore).toBe(false)
        expect(state.hasMore).toBe(false)
    })

    it('si falla "Cargar más" conserva los movimientos y muestra el error', () => {
        const loading = transactionHistoryReducer(readyState, { type: 'MORE_START' })
        const state = transactionHistoryReducer(loading, {
            type: 'MORE_FAILURE',
            error: 'Sin conexión',
        })
        expect(state.items).toEqual(readyState.items)
        expect(state.status).toBe('ready')
        expect(state.loadingMore).toBe(false)
        expect(state.error).toBe('Sin conexión')
    })
})
