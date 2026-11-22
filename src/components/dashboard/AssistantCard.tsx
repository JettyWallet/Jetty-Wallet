import { Sparkles } from 'lucide-react'

// Entrada al chatbot (Gemini, Sprint 2). Por ahora es solo la tarjeta de acceso.
export function AssistantCard() {
    return (
        <section
            aria-label="Asistente de Jetty"
            className="flex h-full flex-col justify-between gap-4 rounded-3xl bg-turquoise/15 p-5 ring-1 ring-turquoise/30 sm:flex-row sm:items-center sm:p-6 lg:flex-col lg:items-stretch"
        >
            <div className="flex items-start gap-4">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-turquoise text-navy">
                    <Sparkles size={20} />
                </span>
                <div>
                    <h2 className="font-bold">Asistente Jetty</h2>
                    <p className="text-sm text-navy/70">
                        Preguntale cuándo conviene cambiar tus monedas o cómo viene tu mes.
                    </p>
                </div>
            </div>
            <button
                type="button"
                disabled
                title="Disponible en el Sprint 2"
                className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
                Próximamente
            </button>
        </section>
    )
}
