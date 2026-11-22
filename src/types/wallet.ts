export type CurrencyCode = 'USD' | 'EUR' | 'COP' | 'ARS'

export interface Balance {
    currency: CurrencyCode
    amount: number
}

export interface WalletSummary {
    balances: Balance[]
    // Tasas: cuántos USD vale 1 unidad de cada moneda (para estimar el total)
    usdRates: Record<CurrencyCode, number>
    // Variación del total en las últimas 24 h, en porcentaje
    change24h: number
}

export type TransactionType = 'deposit' | 'buy' | 'sell' | 'exchange'

export interface Transaction {
    id: string
    type: TransactionType
    fromCurrency: CurrencyCode | null
    toCurrency: CurrencyCode
    fromAmount: number | null
    toAmount: number
    createdAt: string // ISO
}

// Contrato que cumplen el servicio mock y el real (igual que AuthService)
export interface WalletService {
    getSummary(): Promise<WalletSummary>
    getRecentTransactions(limit?: number): Promise<Transaction[]>
}
