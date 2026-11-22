import type { Transaction, WalletService, WalletSummary } from '../types/wallet'

// Servicio MOCK del dashboard. Cuando el backend esté listo, se crea
// walletService.real.ts con el mismo contrato (WalletService) y se cambia aquí.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

// Estado inicial de la Demo 1: el usuario nuevo arranca con 1.000 USD.
const summary: WalletSummary = {
    balances: [
        { currency: 'USD', amount: 1000 },
        { currency: 'EUR', amount: 0 },
        { currency: 'COP', amount: 0 },
        { currency: 'ARS', amount: 0 },
    ],
    usdRates: { USD: 1, EUR: 1.08, COP: 0.00025, ARS: 0.001 },
    change24h: 0,
}

const transactions: Transaction[] = [
    { id: 't1', type: 'deposit', fromCurrency: null, toCurrency: 'USD', fromAmount: null, toAmount: 1000, createdAt: hoursAgo(1) },
]

export const walletService: WalletService = {
    async getSummary() {
        await wait(500)
        return summary
    },
    async getRecentTransactions(limit = 5) {
        await wait(700)
        return transactions.slice(0, limit)
    },
}
