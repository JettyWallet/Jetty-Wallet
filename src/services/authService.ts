import type { AuthService } from '../types/auth'
import { authServiceMock } from './authService.mock'
import { authServiceReal } from './authService.real'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const authService: AuthService = useMock ? authServiceMock : authServiceReal