import { createContext } from 'react'
import type {
    Balance,
    CurrencyCode,
    DepositResult,
    ExchangeRequest,
    ExchangeResult,
    Transaction,
    UsdRates,
} from '../types/wallet'

export type WalletStatus =
    | 'idle' // sin sesión: no se pide nada
    | 'loading' // cargando saldos y cotizaciones
    | 'ready' // datos listos
    | 'error' // no se pudieron cargar

export interface WalletContextValue {
    // Estado
    status: WalletStatus
    balances: Balance[]
    usdRates: UsdRates
    change24h: number
    transactions: Transaction[]
    error: string | null

    // Acciones. deposit y exchange LANZAN el error para que cada formulario
    // lo muestre donde corresponde; ya actualizan los saldos si salen bien.
    refresh: () => Promise<void>
    deposit: (currency: CurrencyCode, amount: number) => Promise<DepositResult>
    exchange: (request: ExchangeRequest) => Promise<ExchangeResult>
}

export const WalletContext = createContext<WalletContextValue | undefined>(undefined)
