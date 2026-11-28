// Contrato con el backend: docs/api.md del repo JettyWallet-backend.

export const CURRENCY_CODES = ['USD', 'EUR', 'COP', 'ARS'] as const
export type CurrencyCode = (typeof CURRENCY_CODES)[number]

// Cuántos USD vale 1 unidad de cada moneda. Si una moneda nunca tuvo
// cotización, el backend no la incluye: por eso es parcial.
export type UsdRates = Partial<Record<CurrencyCode, number>>

export interface Balance {
    currency: CurrencyCode
    amount: number
}

// GET /api/wallet/summary
export interface WalletSummary {
    balances: Balance[]
    usdRates: UsdRates
    // Variación del total en 24 h, en %. El back devuelve 0 por ahora.
    change24h: number
}

// GET /api/rates (pública)
export interface Rates {
    base: 'USD'
    usdRates: UsdRates
    updatedAt: string // ISO: la cotización más vieja de la lista
    stale: boolean // true si no se pudieron renovar (más de 1 h)
}

export type TransactionType = 'deposit' | 'exchange' | 'transfer_in' | 'transfer_out'

export interface Transaction {
    id: string
    type: TransactionType
    fromCurrency: CurrencyCode | null // null en depósitos
    toCurrency: CurrencyCode
    fromAmount: number | null // null en depósitos
    toAmount: number
    // Texto para mostrar que da el back ("Saldo de bienvenida", "Depósito",
    // "Intercambio"). Si es null, la UI usa TRANSACTION_LABEL.
    description: string | null
    createdAt: string // ISO
}

// POST /api/deposits  → 201
export interface DepositResult {
    transaction: Transaction
    // Saldo de esa moneda después del depósito
    balance: Balance
}

// PROVISORIO: POST /api/exchange todavía no tiene contrato publicado.
// Cuando el back lo agregue a docs/api.md, ajustar estos dos tipos.
export interface ExchangeRequest {
    fromCurrency: CurrencyCode
    toCurrency: CurrencyCode
    amount: number
}

export interface ExchangeResult {
    transaction: Transaction
    // Saldos nuevos de las dos monedas involucradas
    balances: Balance[]
}

// Contrato que cumplen el servicio mock y el real (igual que AuthService)
export interface WalletService {
    getSummary(): Promise<WalletSummary>
    getRecentTransactions(limit?: number): Promise<Transaction[]>
    getRates(): Promise<Rates>
    deposit(currency: CurrencyCode, amount: number): Promise<DepositResult>
    exchange(request: ExchangeRequest): Promise<ExchangeResult>
}