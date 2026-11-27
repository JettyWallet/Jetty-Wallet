import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDisplayCurrency } from '../hooks/useDisplayCurrency'
import { useWallet } from '../hooks/useWallet'
import { CURRENCY_CODES } from '../types/wallet'
import { AssistantCard } from '../components/dashboard/AssistantCard'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { CurrencyCard } from '../components/dashboard/CurrencyCard'
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RatesBar } from '../components/dashboard/RatesBar'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
    const { user } = useAuth()
    const { status, balances, usdRates, change24h, transactions, error, refresh } = useWallet()
    // Un solo estado para ocultar saldos en toda la pantalla
    const [hidden, setHidden] = useState(false)
    const [displayCurrency, setDisplayCurrency] = useDisplayCurrency()

    const firstName = user?.name.split(' ')[0]

    // El back ordena por código; acá se muestran siempre en el mismo orden (USD, EUR, COP, ARS).
    const sortedBalances = [...balances].sort(
        (a, b) => CURRENCY_CODES.indexOf(a.currency) - CURRENCY_CODES.indexOf(b.currency),
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Hola, {firstName} 👋</h1>
                <p className="mt-1 text-sm text-navy/70">Este es el resumen de tu billetera.</p>
            </div>

            {(status === 'loading' || status === 'idle') && <DashboardSkeleton />}

            {status === 'error' && (
                <div role="alert" className="rounded-2xl border border-coral/40 bg-coral/10 p-4">
                    <p className="text-sm font-semibold">
                        {error ?? 'No pudimos cargar tu billetera.'}
                    </p>
                    <Button variant="secondary" onClick={() => void refresh()} className="mt-3">
                        Reintentar
                    </Button>
                </div>
            )}

            {status === 'ready' && (
                <>
                    <RatesBar reference={displayCurrency} />
                    <BalanceHero
                        balances={balances}
                        usdRates={usdRates}
                        change24h={change24h}
                        hidden={hidden}
                        onToggleHidden={() => setHidden((h) => !h)}
                        displayCurrency={displayCurrency}
                        onChangeCurrency={setDisplayCurrency}
                    />
                    <QuickActions />

                    <section aria-label="Tus monedas" className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {sortedBalances.map((b) => (
                            <CurrencyCard key={b.currency} balance={b} usdRates={usdRates} hidden={hidden} />
                        ))}
                    </section>

                    <div className="grid gap-6 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                            <RecentActivity items={transactions} hidden={hidden} />
                        </div>
                        <div className="lg:col-span-2">
                            <AssistantCard />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
