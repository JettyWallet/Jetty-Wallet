import type { AuthService } from '../types/auth'
import { authServiceMock } from './authService.mock'
import { authServiceReal } from './authService.real'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const authService: AuthService = useMock ? authServiceMock : authServiceReal

// Reexportado para que el contexto de auth se entere de los 401
// sin tener que importar httpClient directamente.
export { onUnauthorized } from './httpClient'