import { describe, expect, it } from 'vitest'
import { formatDateTime } from './dateTime'

// Las fechas se arman en hora local (new Date(año, mes, ...)): así el test da
// lo mismo en cualquier zona horaria. Ojo: los meses van de 0 a 11.
const localIso = (...args: [number, number, number, number, number]) =>
    new Date(...args).toISOString()

describe('formatDateTime', () => {
    it('muestra día, mes, año y hora en formato 24 h', () => {
        expect(formatDateTime(localIso(2026, 10, 26, 19, 13))).toBe('26 nov 2026, 19:13')
    })

    it('completa con cero las horas y minutos de un dígito', () => {
        expect(formatDateTime(localIso(2026, 0, 5, 7, 4))).toBe('5 ene 2026, 07:04')
    })

    it('devuelve una raya si la fecha no es válida', () => {
        expect(formatDateTime('no-es-una-fecha')).toBe('—')
    })
})