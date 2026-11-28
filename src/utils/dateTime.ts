const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const pad2 = (n: number) => String(n).padStart(2, '0')

// Fecha y hora completas en hora local, formato 24 h: "26 nov 2026, 19:13".
// Para el historial, donde "Hoy" o "26 nov" sin hora no alcanzan para distinguir
// movimientos. Devuelve "—" si la fecha no es válida.
export function formatDateTime(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '—'
    const day = date.getDate()
    const month = MONTHS[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}, ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}