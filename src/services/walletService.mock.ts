import { CURRENCY_CODES } from '../types/wallet'
import type {
    Balance,
    CurrencyCode,
    ExchangeRequest,
    Transaction,
    UsdRates,
    WalletService,
} from '../types/wallet'
import { DEPOSIT_MAX } from '../utils/amount'
import { convertAmount } from '../utils/format'
import { HttpError } from './httpClient'

// Servicio MOCK de la billetera (VITE_USE_MOCK=true): funciona sin backend.
// El estado vive en memoria: al recargar la página vuelve al inicio.
const DELAY_MS = 600
const wait = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))
const round2 = (n: number) => Math.round(n * 100) / 100

const usdRates: UsdRates = { USD: 1, EUR: 1.16, COP: 0.00026, ARS: 0.00069 }

let balances: Balance[] = CURRENCY_CODES.map((currency) => ({
    currency,
    amount: currency === 'USD' ? 1000 : 0,
}))

let transactions: Transaction[] = [
    {
        id: crypto.randomUUID(),
        type: 'deposit',
        fromCurrency: null,
        toCurrency: 'USD',
        fromAmount: null,
        toAmount: 1000,
        description: 'Saldo de bienvenida',
        createdAt: new Date().toISOString(),
    },
]

// Lectura de los movimientos del mock, más recientes primero. La usa el mock
// del historial (transactionService.mock) para mostrar los mismos datos:
// lo que se deposita o intercambia acá aparece también en el historial.
export function getMockTransactions(): readonly Transaction[] {
    return transactions
}

const balanceOf = (currency: CurrencyCode) =>
    balances.find((b) => b.currency === currency)?.amount ?? 0

function setBalance(currency: CurrencyCode, amount: number): Balance {
    const next = { currency, amount: round2(amount) }
    balances = balances.map((b) => (b.currency === currency ? next : b))
    return next
}

export const walletServiceMock: WalletService = {
    async getSummary() {
        await wait()
        return { balances: balances.map((b) => ({ ...b })), usdRates: { ...usdRates }, change24h: 0 }
    },

    async getRecentTransactions(limit = 5) {
        await wait()
        return transactions.slice(0, limit)
    },

    async getRates() {
        await wait(300)
        return { base: 'USD', usdRates: { ...usdRates }, updatedAt: new Date().toISOString(), stale: false }
    },

    async deposit(currency, amount) {
        await wait()
        if (!(amount > 0)) throw new HttpError('El monto debe ser mayor a 0.', 400)
        if (amount > DEPOSIT_MAX) {
            throw new HttpError('El máximo por depósito es 1.000.000.', 422)
        }

        const balance = setBalance(currency, balanceOf(currency) + amount)
        const transaction: Transaction = {
            id: crypto.randomUUID(),
            type: 'deposit',
            fromCurrency: null,
            toCurrency: currency,
            fromAmount: null,
            toAmount: amount,
            description: 'Depósito',
            createdAt: new Date().toISOString(),
        }
        transactions = [transaction, ...transactions]
        return { transaction, balance }
    },

    async exchange({ fromCurrency, toCurrency, amount }: ExchangeRequest) {
        await wait()
        if (fromCurrency === toCurrency) {
            throw new HttpError('Elegí dos monedas distintas.', 400)
        }
        if (!(amount > 0)) throw new HttpError('El monto debe ser mayor a 0.', 400)
        if (Math.round(amount * 100) > Math.round(balanceOf(fromCurrency) * 100)) {
            throw new HttpError('No tenés saldo suficiente para este intercambio.', 422)
        }

        const received = round2(convertAmount(amount, fromCurrency, toCurrency, usdRates) ?? 0)
        const from = setBalance(fromCurrency, balanceOf(fromCurrency) - amount)
        const to = setBalance(toCurrency, balanceOf(toCurrency) + received)
        const transaction: Transaction = {
            id: crypto.randomUUID(),
            type: 'exchange',
            fromCurrency,
            toCurrency,
            fromAmount: amount,
            toAmount: received,
            description: 'Intercambio',
            createdAt: new Date().toISOString(),
        }
        transactions = [transaction, ...transactions]
        return { transaction, balances: [from, to] }
    },
}