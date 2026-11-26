import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { WalletProvider } from './WalletProvider'

interface AppProvidersProps {
    children: ReactNode
}

// Único lugar donde se anidan los providers de la app.
// Regla de orden: un provider solo puede usar lo que está POR ENCIMA de él.
// WalletProvider usa la sesión, por eso va dentro de AuthProvider.
export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <WalletProvider>{children}</WalletProvider>
        </AuthProvider>
    )
}
