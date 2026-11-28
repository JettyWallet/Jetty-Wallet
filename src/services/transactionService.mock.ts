import type { Transaction } from '../types/wallet'
import type { TransactionService } from '../types/transactions'
import { HttpError } from './httpClient'
import { getMockTransactions } from './walletService.mock'

// Servicio MOCK del historial (VITE_USE_MOCK=true). Lee los mismos movimientos
// que el mock de la billetera, e imita las reglas de GET /api/transactions.
const DELAY_MS = 600
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const wait = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export const transactionServiceMock: TransactionService = {
    async getTransactions({ limit = DEFAULT_LIMIT, before, type, currency } = {}) {
        await wait()

        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
            throw new HttpError('El límite tiene que ser un número entero entre 1 y 100.', 400)
        }

        let items: readonly Transaction[] = getMockTransactions()

        // Cursor: se ubica `before` en la lista completa y se sigue desde el
        // siguiente. Recién después se filtra, como hace el back.
        if (before !== undefined) {
            const index = items.findIndex((t) => t.id === before)
            if (index === -1) {
                throw new HttpError('El movimiento indicado no existe en tu billetera.', 400)
            }
            items = items.slice(index + 1)
        }

        if (type) items = items.filter((t) => t.type === type)
        if (currency) {
            items = items.filter((t) => t.fromCurrency === currency || t.toCurrency === currency)
        }

        // Copias: quien recibe la lista no puede modificar los datos del mock.
        return items.slice(0, limit).map((t) => ({ ...t }))
    },
}