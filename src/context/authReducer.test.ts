import { describe, expect, it } from 'vitest'
import type { User } from '../types/auth'
import { authReducer, SESSION_EXPIRED_MESSAGE, type AuthState } from './authReducer'

const user: User = { id: '1', name: 'Ana', email: 'ana@jetty.com' }

const authenticated: AuthState = {
    user,
    status: 'authenticated',
    error: null,
    notice: null,
}

describe('authReducer: SESSION_EXPIRED', () => {
    it('con sesión activa, cierra la sesión y deja el aviso', () => {
        const next = authReducer(authenticated, { type: 'SESSION_EXPIRED' })

        expect(next).toEqual({
            user: null,
            status: 'unauthenticated',
            error: null,
            notice: SESSION_EXPIRED_MESSAGE,
        })
    })

    it('al arrancar la app (initializing) no cambia nada', () => {
        const state: AuthState = { user: null, status: 'initializing', error: null, notice: null }

        // toBe: tiene que devolver el MISMO objeto (así React no re-renderiza)
        expect(authReducer(state, { type: 'SESSION_EXPIRED' })).toBe(state)
    })

    it('durante un login (authenticating) no cambia nada', () => {
        const state: AuthState = { user: null, status: 'authenticating', error: null, notice: null }

        expect(authReducer(state, { type: 'SESSION_EXPIRED' })).toBe(state)
    })
})

describe('authReducer: aviso de sesión vencida', () => {
    const expired: AuthState = {
        user: null,
        status: 'unauthenticated',
        error: null,
        notice: SESSION_EXPIRED_MESSAGE,
    }

    it('CLEAR_ERROR no borra el aviso (LoginPage lo llama al montarse)', () => {
        const withError: AuthState = { ...expired, error: 'Algún error viejo' }

        const next = authReducer(withError, { type: 'CLEAR_ERROR' })

        expect(next.error).toBeNull()
        expect(next.notice).toBe(SESSION_EXPIRED_MESSAGE)
    })

    it('AUTH_START borra el aviso al reintentar el login', () => {
        const next = authReducer(expired, { type: 'AUTH_START' })

        expect(next.status).toBe('authenticating')
        expect(next.notice).toBeNull()
    })
})