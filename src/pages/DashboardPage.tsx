import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAsync } from '../hooks/useAsync'
import { walletService } from '../services/walletService'
import { AssistantCard } from '../components/dashboard/AssistantCard'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { CurrencyCard } from '../components/dashboard/CurrencyCard'
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentActivity } from '../components/dashboard/RecentActivity'

const loadDashboard = () =>
    Promise.all([walletService.getSummary(), walletService.getRecentTransactions(5)])

export function DashboardPage() {
    const { user } = useAuth()
    const { data, loading, error } = useAsync(loadDashboard)
    // Un solo estado para ocultar saldos en toda la pantalla
    const [hidden, setHidden] = useState(false)

    const firstName = user?.name.split(' ')[0]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Hola, {firstName} 👋</h1>
                <p className="mt-1 text-sm text-navy/70">Este es el resumen de tu billetera.</p>
            </div>

            {loading && <DashboardSkeleton />}

            {error && (
                <p role="alert" className="rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm font-semibold">
                    {error}
                </p>
            )}

            {data && (
                <>
                    <BalanceHero summary={data[0]} hidden={hidden} onToggleHidden={() => setHidden((h) => !h)} />
                    <QuickActions />

                    <section aria-label="Tus monedas" className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {data[0].balances.map((b) => (
                            <CurrencyCard key={b.currency} balance={b} hidden={hidden} />
                        ))}
                    </section>

                    <div className="grid gap-6 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                            <RecentActivity items={data[1]} hidden={hidden} />
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
