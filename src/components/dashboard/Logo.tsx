export function Logo({ light = false }: { light?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl bg-turquoise font-bold text-navy"
            >
                J
            </span>
            <span className={`text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>
                Jetty<span className="text-turquoise">Wallet</span>
            </span>
        </div>
    )
}
