import type {
    Balance,
    CurrencyCode,
    DepositResult,
    ExchangeRequest,
    ExchangeResult,
    Rates,
    Transaction,
    WalletService,
    WalletSummary,
} from '../types/wallet'
import { HttpError, request } from './httpClient'

// El back ya convierte los montos a número, pero normalizamos por si algún
// endpoint los devuelve como texto (pg entrega NUMERIC como string).
const toBalance = (b: Balance): Balance => ({ currency: b.currency, amount: Number(b.amount) })

const toTransaction = (t: Transaction): Transaction => ({
    ...t,
    fromAmount: t.fromAmount === null ? null : Number(t.fromAmount),
    toAmount: Number(t.toAmount),
})

export const walletServiceReal: WalletService = {
    // GET /api/wallet/summary (con sesión)
    async getSummary() {
        const summary = await request<WalletSummary>('/wallet/summary')
        return { ...summary, balances: summary.balances.map(toBalance) }
    },

    // GET /api/transactions?limit=N: el back todavía no lo tiene (Fase 1).
    // Mientras responda 404 se devuelve una lista vacía y, cuando exista,
    // el dashboard lo muestra solo, sin tocar nada.
    async getRecentTransactions(limit = 5) {
        try {
            const items = await request<Transaction[]>(`/transactions?limit=${limit}`)
            return items.map(toTransaction)
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return []
            throw error
        }
    },

    // GET /api/rates (pública). 503 si no hay cotizaciones disponibles.
    async getRates() {
        return request<Rates>('/rates')
    },

    // POST /api/deposits. Cada request es un depósito nuevo: el que llama
    // tiene que evitar el doble envío.
    async deposit(currency: CurrencyCode, amount: number) {
        const result = await request<DepositResult>('/deposits', {
            method: 'POST',
            body: { currency, amount },
        })
        return { transaction: toTransaction(result.transaction), balance: toBalance(result.balance) }
    },

    // POST /api/exchange: contrato provisorio, el endpoint todavía no existe.
    async exchange(body: ExchangeRequest) {
        try {
            const result = await request<ExchangeResult>('/exchange', { method: 'POST', body })
            return {
                transaction: toTransaction(result.transaction),
                balances: result.balances.map(toBalance),
            }
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                throw new HttpError(
                    'El intercambio todavía no está disponible. Lo estamos terminando.',
                    404,
                )
            }
            throw error
        }
    },
}
