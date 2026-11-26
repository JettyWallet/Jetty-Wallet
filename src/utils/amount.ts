// Máximo por depósito. Lo valida el backend (422); acá se valida antes para avisar rápido.
export const DEPOSIT_MAX = 1_000_000

export type AmountParse = { ok: true; value: number } | { ok: false; error: string }

// Convierte lo que escribe el usuario en un número.
// Acepta coma o punto SOLO como separador decimal, con hasta 2 decimales.
// A propósito rechaza "50.000": sería leído como 50, y un monto mal
// interpretado en una billetera es peor que un mensaje de error.
export function parseAmount(raw: string): AmountParse {
    const text = raw.trim().replace(',', '.')

    if (text === '') return { ok: false, error: 'Ingresá un monto.' }

    if (!/^\d+(\.\d+)?$/.test(text)) {
        return {
            ok: false,
            error: 'Escribí solo números. Usá coma o punto únicamente para los decimales.',
        }
    }

    const decimals = text.split('.')[1]?.length ?? 0
    if (decimals > 2) {
        return {
            ok: false,
            error: 'Usá hasta 2 decimales y no uses puntos para separar miles (ej: 50000 o 1250,50).',
        }
    }

    const value = Number(text)
    if (!(value > 0)) return { ok: false, error: 'El monto debe ser mayor a 0.' }

    return { ok: true, value }
}

// Compara en centavos para evitar errores de coma flotante (0.1 + 0.2).
export function exceeds(amount: number, limit: number): boolean {
    return Math.round(amount * 100) > Math.round(limit * 100)
}
