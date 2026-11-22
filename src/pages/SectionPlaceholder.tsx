// Pantallas del Sprint 2 (monedas, operar, historial): por ahora marcan el lugar en el menú.
export function SectionPlaceholder({ title }: { title: string }) {
    return (
        <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-6 rounded-3xl bg-white p-10 text-center text-sm text-navy/60 shadow-sm ring-1 ring-navy/5">
                Esta sección llega en el Sprint 2.
            </p>
        </div>
    )
}
