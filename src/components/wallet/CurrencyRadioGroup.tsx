import { CURRENCY_CODES, type CurrencyCode } from '../../types/wallet'
import { CURRENCIES } from '../../utils/format'

interface CurrencyRadioGroupProps {
    label: string
    name: string
    value: CurrencyCode
    onChange: (currency: CurrencyCode) => void
    disabled?: boolean
}

// Radios nativos: el teclado (flechas, Tab) y los lectores de pantalla funcionan solos.
export function CurrencyRadioGroup({ label, name, value, onChange, disabled }: CurrencyRadioGroupProps) {
    return (
        <fieldset disabled={disabled} className="min-w-0">
            <legend className="mb-2 text-sm font-semibold">{label}</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CURRENCY_CODES.map((code) => (
                    <label
                        key={code}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/20 bg-white p-3 transition hover:border-navy/40 has-[:checked]:border-turquoise has-[:checked]:bg-turquoise/10 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turquoise has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={code}
                            checked={value === code}
                            onChange={() => onChange(code)}
                            className="sr-only"
                        />
                        <span aria-hidden="true" className="text-xl">
                            {CURRENCIES[code].flag}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-bold">{code}</span>
                            <span className="block truncate text-xs text-navy/60">{CURRENCIES[code].name}</span>
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    )
}
