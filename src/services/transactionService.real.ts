import type { Transaction } from '../types/wallet'
import type { TransactionQuery, TransactionService } from '../types/transactions'
import { request } from './httpClient'

// Misma normalización que walletService.real: el back puede devolver los montos
// como texto (pg entrega NUMERIC como string). `description` se completa con
// null si no viene, para que la UI siempre pueda usar el texto por defecto.
const toTransaction = (t: Transaction): Transaction => ({
    ...t,
    fromAmount: t.fromAmount === null ? null : Number(t.fromAmount),
    toAmount: Number(t.toAmount),
    description: t.description ?? null,
})

// Arma "?limit=20&before=..." solo con los parámetros que tienen valor.
// URLSearchParams se encarga de escapar los caracteres especiales.
function buildQueryString({ limit, before, type, currency }: TransactionQuery): string {
    const params = new URLSearchParams()
    if (limit !== undefined) params.set('limit', String(limit))
    if (before) params.set('before', before)
    if (type) params.set('type', type)
    if (currency) params.set('currency', currency)
    const text = params.toString()
    return text ? `?${text}` : ''
}

export const transactionServiceReal: TransactionService = {
    // GET /api/transactions (con sesión). 400 si algún parámetro es inválido.
    async getTransactions(query = {}) {
        const items = await request<Transaction[]>(`/transactions${buildQueryString(query)}`)
        return items.map(toTransaction)
    },
}