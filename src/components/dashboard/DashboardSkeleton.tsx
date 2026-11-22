export function DashboardSkeleton() {
    return (
        <div role="status" aria-live="polite" className="animate-pulse space-y-6">
            <span className="sr-only">Cargando tu billetera...</span>
            <div className="h-44 rounded-3xl bg-navy/10" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-2xl bg-navy/10" />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-navy/10" />
                ))}
            </div>
            <div className="h-64 rounded-3xl bg-navy/10" />
        </div>
    )
}
