import type { WalletService } from '../types/wallet'
import { walletServiceMock } from './walletService.mock'
import { walletServiceReal } from './walletService.real'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const walletService: WalletService = useMock ? walletServiceMock : walletServiceReal
