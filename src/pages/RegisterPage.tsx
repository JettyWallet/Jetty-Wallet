import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { RegisterForm, type RegisterFormValues } from '../components/auth/RegisterForm'
import { BrandLogo } from '../components/ui/BrandLogo'
import { GoogleButton } from '../components/ui/GoogleButton'

export function RegisterPage() {
    const { status, error, register, loginWithGoogle, clearError } = useAuth()

    // Al entrar, limpiamos errores que hayan quedado de otra pantalla.
    useEffect(() => {
        clearError()
    }, [clearError])

    // Ya hay sesión (por ejemplo, justo después de registrarse): al dashboard.
    if (status === 'authenticated') {
        return <Navigate to="/dashboard" replace />
    }

    const isLoading = status === 'authenticating'

    const handleSubmit = async (values: RegisterFormValues) => {
        await register(values)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-cream p-6 text-navy">
            <BrandLogo />

            <section className="w-full max-w-md rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-2xl font-bold sm:text-3xl">Creá tu cuenta</h1>
                <p className="mb-6 mt-1 text-sm text-navy/70">
                    Empezá a manejar tus monedas desde un solo lugar.
                </p>

                <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} serverError={error} />

                <div className="my-6 flex items-center gap-3 text-sm text-navy/70" aria-hidden="true">
                    <span className="h-px flex-1 bg-navy/15" />
                    o
                    <span className="h-px flex-1 bg-navy/15" />
                </div>

                <GoogleButton disabled={isLoading} onClick={() => void loginWithGoogle()} />
            </section>

            <p className="text-sm">
                ¿Ya tenés cuenta?{' '}
                <Link
                    to="/login"
                    className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                    Iniciá sesión
                </Link>
            </p>
        </main>
    )
}