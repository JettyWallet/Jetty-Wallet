import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { CurrencyRadioGroup } from '../components/wallet/CurrencyRadioGroup'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useDisplayCurrency } from '../hooks/useDisplayCurrency'
import { useWallet } from '../hooks/useWallet'
import type { CurrencyCode, DepositResult } from '../types/wallet'
import { DEPOSIT_MAX, exceeds, parseAmount } from '../utils/amount'
import { CURRENCIES, convertAmount, formatMoney } from '../utils/format'

const cardClass = 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 sm:p-6'

export function DepositPage() {
    const { balances, usdRates, deposit } = useWallet()
    const [displayCurrency] = useDisplayCurrency()

    const [currency, setCurrency] = useState<CurrencyCode>('USD')
    const [amountText, setAmountText] = useState('')
    const [fieldError, setFieldError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState<DepositResult | null>(null)

    // Cada request es un depósito nuevo: este ref corta el doble envío aunque
    // el usuario dispare el formulario dos veces antes de que React deshabilite el botón.
    const submittingRef = useRef(false)

    const currentBalance = balances.find((b) => b.currency === currency)?.amount
    const parsed = parseAmount(amountText)

    // Equivalencia en la moneda elegida para el total. Si se deposita en esa misma
    // moneda, se muestra en USD; si las dos son USD, no hay equivalencia que mostrar.
    const equivalentCurrency: CurrencyCode | null =
        currency !== displayCurrency ? displayCurrency : currency !== 'USD' ? 'USD' : null
    const equivalent =
        parsed.ok && equivalentCurrency
            ? convertAmount(parsed.value, currency, equivalentCurrency, usdRates)
            : null

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submittingRef.current) return

        setSubmitError(null)
        if (!parsed.ok) {
            setFieldError(parsed.error)
            return
        }
        if (exceeds(parsed.value, DEPOSIT_MAX)) {
            setFieldError(`El máximo por depósito es ${formatMoney(DEPOSIT_MAX)} ${currency}.`)
            return
        }
        setFieldError(null)

        submittingRef.current = true
        setSubmitting(true)
        try {
            const result = await deposit(currency, parsed.value)
            setSuccess(result)
            setAmountText('')
        } catch (err) {
            // El back responde { message } listo para mostrar
            setSubmitError(err instanceof Error ? err.message : 'No pudimos hacer el depósito.')
        } finally {
            submittingRef.current = false
            setSubmitting(false)
        }
    }

    if (success) {
        const { transaction, balance } = success
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold sm:text-3xl">Depositar</h1>
                <section role="status" className={`${cardClass} text-center`}>
                    <CheckCircle2 size={48} className="mx-auto text-turquoise" aria-hidden="true" />
                    <h2 className="mt-4 text-xl font-bold">¡Depósito realizado!</h2>
                    <p className="mt-2 text-3xl font-bold text-turquoise">
                        + {formatMoney(transaction.toAmount)} {transaction.toCurrency}
                    </p>
                    <p className="mt-2 text-sm text-navy/70">
                        Tu nuevo saldo en {balance.currency}: {CURRENCIES[balance.currency].symbol}{' '}
                        {formatMoney(balance.amount)}
                    </p>
                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button onClick={() => setSuccess(null)}>Hacer otro depósito</Button>
                        <Link
                            to="/dashboard"
                            className="rounded-lg border border-navy bg-white px-4 py-3 text-center font-semibold text-navy transition hover:bg-navy/5"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Depositar</h1>
                <p className="mt-1 text-sm text-navy/70">
                    Sumá fondos a tu billetera. Los fondos son simulados.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className={`${cardClass} space-y-6`}>
                <CurrencyRadioGroup
                    label="¿En qué moneda querés depositar?"
                    name="deposit-currency"
                    value={currency}
                    onChange={setCurrency}
                    disabled={submitting}
                />

                <div>
                    <FormField
                        label={`Monto en ${currency}`}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0,00"
                        value={amountText}
                        onChange={(e) => {
                            setAmountText(e.target.value)
                            setFieldError(null)
                        }}
                        error={fieldError ?? undefined}
                        disabled={submitting}
                    />
                    <p className="mt-2 text-xs text-navy/60">
                        Máximo {formatMoney(DEPOSIT_MAX)} por depósito. Hasta 2 decimales.
                        {currentBalance !== undefined &&
                            ` Saldo actual: ${CURRENCIES[currency].symbol} ${formatMoney(currentBalance)} ${currency}.`}
                    </p>
                    {parsed.ok && !fieldError && (
                        <p className="mt-2 text-sm font-semibold" aria-live="polite">
                            Vas a depositar {CURRENCIES[currency].symbol} {formatMoney(parsed.value)} {currency}
                            {equivalent !== null && equivalentCurrency && (
                                <span className="font-normal text-navy/70">
                                    {' '}
                                    (≈ {CURRENCIES[equivalentCurrency].symbol} {formatMoney(equivalent)}{' '}
                                    {equivalentCurrency})
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {submitError && (
                    <p role="alert" className="rounded-xl border border-coral/40 bg-coral/10 p-3 text-sm font-semibold">
                        {submitError}
                    </p>
                )}

                {/* Deshabilitado mientras espera la respuesta: un doble clic depositaría dos veces */}
                <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                    Depositar
                </Button>
            </form>
        </div>
    )
}
