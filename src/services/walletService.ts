import type { Transaction, WalletService, WalletSummary } from '../types/wallet'

// Servicio MOCK del dashboard. Cuando el backend esté listo, se crea
// walletService.real.ts con el mismo contrato (WalletService) y se cambia aquí.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

const summary: WalletSummary = {
    balances: [
        { currency: 'USD', amount: 1000 },
        { currency: 'EUR', amount: 250 },
        { currency: 'COP', amount: 1_850_000 },
        { currency: 'ARS', amount: 320_000 },
    ],
    usdRates: { USD: 1, EUR: 1.08, COP: 0.00025, ARS: 0.001 },
    change24h: 1.8,
}

const transactions: Transaction[] = [
    { id: 't1', type: 'exchange', fromCurrency: 'USD', toCurrency: 'COP', fromAmount: 100, toAmount: 400_000, createdAt: hoursAgo(2) },
    { id: 't2', type: 'buy', fromCurrency: 'USD', toCurrency: 'EUR', fromAmount: 270, toAmount: 250, createdAt: hoursAgo(20) },
    { id: 't3', type: 'sell', fromCurrency: 'ARS', toCurrency: 'USD', fromAmount: 150_000, toAmount: 142, createdAt: hoursAgo(52) },
    { id: 't4', type: 'deposit', fromCurrency: null, toCurrency: 'USD', fromAmount: null, toAmount: 1000, createdAt: hoursAgo(120) },
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
