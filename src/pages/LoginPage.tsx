import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm, type LoginFormValues } from '../components/auth/LoginForm'
import { BrandLogo } from '../components/ui/BrandLogo'

interface LocationState {
    from?: { pathname: string }
}

export function LoginPage() {
    const { status, error, login, clearError } = useAuth()
    const location = useLocation()

    // Si venía de una ruta protegida, vuelve ahí; si no, al dashboard.
    const from = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard'

    // Al entrar, limpiamos errores que hayan quedado de otra pantalla.
    useEffect(() => {
        clearError()
    }, [clearError])

    // Ya hay sesión: no tiene sentido mostrar el login.
    if (status === 'authenticated') {
        return <Navigate to={from} replace />
    }

    const isLoading = status === 'authenticating'

    const handleSubmit = async (values: LoginFormValues) => {
        await login(values)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-cream p-6 text-navy">
            <BrandLogo />

            <section className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-2xl font-bold sm:text-3xl">Hola de nuevo 👋</h1>
                <p className="mb-6 mt-1 text-sm text-navy/70">
                    Iniciá sesión para ver el resumen de tu billetera.
                </p>

                <LoginForm onSubmit={handleSubmit} isLoading={isLoading} serverError={error} />
            </section>

            <p className="text-sm">
                ¿No tenés cuenta?{' '}
                <Link
                    to="/register"
                    className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                    Registrate
                </Link>
            </p>
        </main>
    )
}