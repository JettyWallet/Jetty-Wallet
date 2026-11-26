import { useContext } from 'react'
import { WalletContext, type WalletContextValue } from '../context/walletContextValue'

export function useWallet(): WalletContextValue {
    const context = useContext(WalletContext)

    if (context === undefined) {
        throw new Error('useWallet debe usarse dentro de un <WalletProvider>')
    }

    return context
}
