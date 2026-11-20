import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    variant?: 'primary' | 'secondary'
}

export function Button({
    loading = false,
    variant = 'primary',
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const styles =
        variant === 'primary'
            ? 'bg-navy text-white hover:bg-navy/90'
            : 'border border-navy bg-white text-navy hover:bg-navy/5'

    return (
        <button
            disabled={disabled || loading}
            aria-busy={loading}
            className={`rounded-lg px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
            {...props}
        >
            {loading ? 'Cargando...' : children}
        </button>
    )
}