import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'

interface AppProvidersProps {
    children: ReactNode
}

// Único lugar donde se anidan los providers de la app.
// Regla de orden: un provider solo puede usar lo que está POR ENCIMA de él.
export function AppProviders({ children }: AppProvidersProps) {
    return <AuthProvider>{children}</AuthProvider>
}
