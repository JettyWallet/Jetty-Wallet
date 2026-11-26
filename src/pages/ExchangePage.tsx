import { useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowDownUp, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useAsync } from '../hooks/useAsync'
import { useWallet } from '../hooks/useWallet'
import { walletService } from '../services/walletService'
import { CURRENCY_CODES, type CurrencyCode, type ExchangeResult } from '../types/wallet'
import { exceeds, parseAmount } from '../utils/amount'
import { CURRENCIES, convertAmount, formatMoney } from '../utils/format'

const cardClass = 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5 sm:p-6'

// Las cotizaciones chicas (ej: 1 COP = 0,00026 USD) necesitan más decimales para no verse como 0.
function formatRate(value: number): string {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: value >= 1 ? 2 : 6 }).format(value)
}

interface CurrencySelectProps {
    label: string
    value: CurrencyCode
    onChange: (currency: CurrencyCode) => void
    disabled?: boolean
}

function CurrencySelect({ label, value, onChange, disabled }: CurrencySelectProps) {
    const id = useId()
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value as CurrencyCode)}
                disabled={disabled}
                className="w-full rounded-lg border border-navy/40 bg-white px-4 py-3 text-navy disabled:cursor-not-allowed disabled:opacity-60"
            >
                {CURRENCY_CODES.map((code) => (
                    <option key={code} value={code}>
                        {CURRENCIES[code].flag} {code} · {CURRENCIES[code].name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export function ExchangePage() {
    const { status, balances, exchange, refresh } = useWallet()
    // Cotizaciones públicas del back (se renuevan cada hora)
    const rates = useAsync(walletService.getRates)

    const [from, setFrom] = useState<CurrencyCode>('USD')
    const [to, setTo] = useState<CurrencyCode>('COP')
    const [amountText, setAmountText] = useState('')
    const [fieldError, setFieldError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState<ExchangeResult | null>(null)
    const submittingRef = useRef(false)

    const available = balances.find((b) => b.currency === from)?.amount ?? 0
    const parsed = parseAmount(amountText)
    const usdRates = rates.data?.usdRates ?? {}

    const unitRate = convertAmount(1, from, to, usdRates)
    const estimate = parsed.ok ? convertAmount(parsed.value, from, to, usdRates) : null

    // Nunca quedan las dos monedas iguales: si se elige la que está en el otro lado, se intercambian.
    function changeFrom(next: CurrencyCode) {
        if (next === to) setTo(from)
        setFrom(next)
        setFieldError(null)
    }

    function changeTo(next: CurrencyCode) {
        if (next === from) setFrom(to)
        setTo(next)
        setFieldError(null)
    }

    function swap() {
        setFrom(to)
        setTo(from)
        setFieldError(null)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submittingRef.current) return

        setSubmitError(null)
        if (!parsed.ok) {
            setFieldError(parsed.error)
            return
        }
        if (exceeds(parsed.value, available)) {
            setFieldError(
                `No tenés saldo suficiente. Disponible: ${formatMoney(available)} ${from}.`,
            )
            return
        }
        setFieldError(null)

        submittingRef.current = true
        setSubmitting(true)
        try {
            const result = await exchange({ fromCurrency: from, toCurrency: to, amount: parsed.value })
            setSuccess(result)
            setAmountText('')
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'No pudimos hacer el intercambio.')
        } finally {
            submittingRef.current = false
            setSubmitting(false)
        }
    }

    if (success) {
        const { transaction, balances: updated } = success
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold sm:text-3xl">Intercambiar</h1>
                <section role="status" className={`${cardClass} text-center`}>
                    <CheckCircle2 size={48} className="mx-auto text-turquoise" aria-hidden="true" />
                    <h2 className="mt-4 text-xl font-bold">¡Intercambio realizado!</h2>
                    {transaction.fromAmount !== null && transaction.fromCurrency && (
                        <p className="mt-2 text-sm text-navy/70">
                            − {formatMoney(transaction.fromAmount)} {transaction.fromCurrency}
                        </p>
                    )}
                    <p className="mt-1 text-3xl font-bold text-turquoise">
                        + {formatMoney(transaction.toAmount)} {transaction.toCurrency}
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-navy/70">
                        {updated.map((b) => (
                            <li key={b.currency}>
                                Saldo en {b.currency}: {CURRENCIES[b.currency].symbol} {formatMoney(b.amount)}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <Button onClick={() => setSuccess(null)}>Hacer otro intercambio</Button>
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

    // Sin saldos cargados no se puede validar nada
    if (status !== 'ready') {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold sm:text-3xl">Intercambiar</h1>
                {status === 'error' ? (
                    <div role="alert" className="rounded-2xl border border-coral/40 bg-coral/10 p-4">
                        <p className="text-sm font-semibold">No pudimos cargar tus saldos.</p>
                        <Button variant="secondary" onClick={() => void refresh()} className="mt-3">
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <p role="status" className="text-sm text-navy/70">
                        Cargando tus saldos...
                    </p>
                )}
            </div>
        )
    }

    const ratesReady = !rates.loading && rates.data !== null
    const formDisabled = submitting || !ratesReady

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Intercambiar</h1>
                <p className="mt-1 text-sm text-navy/70">
                    Cambiá entre USD, EUR, COP y ARS. Los fondos son simulados.
                </p>
            </div>

            {rates.loading && (
                <p role="status" className="text-sm text-navy/70">
                    Cargando cotizaciones...
                </p>
            )}

            {rates.error && (
                <div role="alert" className="rounded-2xl border border-coral/40 bg-coral/10 p-4">
                    <p className="text-sm font-semibold">{rates.error}</p>
                    <Button variant="secondary" onClick={rates.reload} className="mt-3">
                        Reintentar
                    </Button>
                </div>
            )}

            {rates.data?.stale && (
                <p
                    role="status"
                    className="flex items-start gap-2 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm font-semibold"
                >
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    No pudimos actualizar las cotizaciones. Las que ves pueden estar desactualizadas
                    (última actualización: {new Date(rates.data.updatedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}).
                </p>
            )}

            <form onSubmit={handleSubmit} noValidate className={`${cardClass} space-y-5`}>
                <CurrencySelect label="Tengo" value={from} onChange={changeFrom} disabled={formDisabled} />

                <div>
                    <FormField
                        label={`Monto en ${from}`}
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
                        disabled={formDisabled}
                    />
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 text-xs text-navy/60">
                        Disponible: {CURRENCIES[from].symbol} {formatMoney(available)} {from}
                        <button
                            type="button"
                            onClick={() => {
                                setAmountText(String(available))
                                setFieldError(null)
                            }}
                            disabled={formDisabled || available <= 0}
                            className="font-semibold text-turquoise underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                        >
                            Usar todo
                        </button>
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={swap}
                        disabled={formDisabled}
                        aria-label="Invertir monedas"
                        title="Invertir monedas"
                        className="grid size-11 place-items-center rounded-full border border-navy/20 bg-cream transition hover:bg-turquoise/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <ArrowDownUp size={18} aria-hidden="true" />
                    </button>
                </div>

                <CurrencySelect label="Quiero" value={to} onChange={changeTo} disabled={formDisabled} />

                {/* Estimación con las cotizaciones de /api/rates */}
                <div className="rounded-2xl bg-cream p-4" aria-live="polite">
                    {!ratesReady ? (
                        <p className="text-sm text-navy/60">La estimación aparece cuando cargan las cotizaciones.</p>
                    ) : unitRate === null ? (
                        <p className="text-sm font-semibold">
                            No hay cotización disponible para {from} y {to}. Probá con otras monedas.
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-navy/70">
                                Recibirías aproximadamente
                            </p>
                            <p className="mt-1 text-2xl font-bold text-turquoise">
                                {estimate !== null
                                    ? `${CURRENCIES[to].symbol} ${formatMoney(estimate)} ${to}`
                                    : `— ${to}`}
                            </p>
                            <p className="mt-2 text-xs text-navy/60">
                                1 {from} ≈ {formatRate(unitRate)} {to}. El intercambio usa la cotización del
                                momento en que lo confirmás, así que el monto final puede variar.
                            </p>
                        </>
                    )}
                </div>

                {submitError && (
                    <p role="alert" className="rounded-xl border border-coral/40 bg-coral/10 p-3 text-sm font-semibold">
                        {submitError}
                    </p>
                )}

                <Button
                    type="submit"
                    loading={submitting}
                    disabled={!ratesReady || unitRate === null}
                    className="w-full sm:w-auto"
                >
                    Intercambiar
                </Button>
            </form>
        </div>
    )
}
