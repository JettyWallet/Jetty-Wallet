import { useCallback, useState } from 'react'
import { CURRENCY_CODES, type CurrencyCode } from '../types/wallet'

const STORAGE_KEY = 'jetty_display_currency'

function readStored(): CurrencyCode {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && (CURRENCY_CODES as readonly string[]).includes(saved)) {
            return saved as CurrencyCode
        }
    } catch {
        // Sin storage disponible: se usa el valor por defecto
    }
    return 'USD'
}

// Moneda en la que el usuario quiere ver el total. Se recuerda entre visitas,
// pero es solo una comodidad: si el storage falla, la pantalla funciona igual.
export function useDisplayCurrency(): [CurrencyCode, (currency: CurrencyCode) => void] {
    const [currency, setCurrency] = useState<CurrencyCode>(readStored)

    const change = useCallback((next: CurrencyCode) => {
        setCurrency(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // No se pudo guardar: no es grave
        }
    }, [])

    return [currency, change]
}
