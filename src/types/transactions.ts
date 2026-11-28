import type { CurrencyCode, Transaction, TransactionType } from './wallet'

// Parámetros de GET /api/transactions (todos opcionales). Ver docs/api.md del back.
export interface TransactionQuery {
    // Cantidad de movimientos: entero de 1 a 100. Si no se manda, el back usa 20.
    limit?: number
    // Paginación por cursor ("Cargar más"): id del último movimiento recibido.
    // Devuelve los movimientos anteriores a ese.
    before?: string
    // Filtro por tipo de movimiento.
    type?: TransactionType
    // Filtro por moneda: movimientos donde esa moneda entra o sale.
    currency?: CurrencyCode
}

// Contrato que cumplen el servicio mock y el real del historial.
export interface TransactionService {
    // Más recientes primero. Si llegan menos que `limit`, no hay más.
    getTransactions(query?: TransactionQuery): Promise<Transaction[]>
}