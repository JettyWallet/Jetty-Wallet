import { describe, expect, it } from 'vitest'
import { buildQuote, convertAmount, formatDate, formatQuote, timeAgo } from './format'

const usdRates = { USD: 1, EUR: 1.16, COP: 0.00026, ARS: 1 / 1601.25 }

describe('formatDate', () => {
    // 27 nov 2026, 08:00 hora local
    const now = new Date(2026, 10, 27, 8, 0)

    it('algo de las 23:00 de ayer es "Ayer", aunque hayan pasado menos de 24 h', () => {
        expect(formatDate(new Date(2026, 10, 26, 23, 0).toISOString(), now)).toMatch(/^Ayer/)
    })
    it('algo de hace unas horas el mismo día es "Hoy"', () => {
        expect(formatDate(new Date(2026, 10, 27, 1, 0).toISOString(), now)).toMatch(/^Hoy/)
    })
    it('una fecha más vieja muestra día y mes', () => {
        expect(formatDate(new Date(2026, 10, 20, 12, 0).toISOString(), now)).not.toMatch(/Hoy|Ayer/)
    })
    it('una fecha inválida no rompe la pantalla', () => {
        expect(formatDate('basura', now)).toBe('—')
    })
})

describe('buildQuote / formatQuote', () => {
    it('con ARS de referencia: 1 USD = 1.601,25 ARS', () => {
        const q = buildQuote('USD', 'ARS', usdRates)
        expect(q && formatQuote(q)).toBe('1 USD = 1.601,25 ARS')
    })
    it('monedas de poco valor se muestran por mil', () => {
        const q = buildQuote('COP', 'USD', usdRates)
        expect(q && formatQuote(q)).toBe('1.000 COP = 0,26 USD')
    })
    it('sin cotización devuelve null', () => {
        expect(buildQuote('COP', 'USD', { USD: 1 })).toBeNull()
    })
})

describe('equivalencia de depósito', () => {
    it('100 USD ≈ 160.125 ARS', () => {
        expect(convertAmount(100, 'USD', 'ARS', usdRates)).toBeCloseTo(160125, 2)
    })
})

describe('timeAgo', () => {
    const now = new Date('2026-11-27T12:00:00Z')
    it('minutos y horas', () => {
        expect(timeAgo('2026-11-27T11:55:00Z', now)).toBe('hace 5 min')
        expect(timeAgo('2026-11-27T09:00:00Z', now)).toBe('hace 3 horas')
    })
})
