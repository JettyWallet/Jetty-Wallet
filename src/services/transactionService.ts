import type { TransactionService } from '../types/transactions'
import { transactionServiceMock } from './transactionService.mock'
import { transactionServiceReal } from './transactionService.real'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const transactionService: TransactionService = useMock
    ? transactionServiceMock
    : transactionServiceReal