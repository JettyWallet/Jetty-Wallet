import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { RegisterForm, type RegisterFormValues } from '../components/auth/RegisterForm'
import { Button } from '../components/ui/Button'

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
        <main className="flex min-h-screen items-center justify-center bg-cream p-6 text-navy">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-bold">Creá tu cuenta</h1>
                <p className="mb-6 text-sm text-navy/80">
                    Empezá a usar tu billetera Jetty Wallet.
                </p>

                <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} serverError={error} />

                <div className="my-6 flex items-center gap-3 text-sm text-navy/70" aria-hidden="true">
                    <span className="h-px flex-1 bg-navy/20" />
                    o
                    <span className="h-px flex-1 bg-navy/20" />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => void loginWithGoogle()}
                >
                    Continuar con Google
                </Button>

                <p className="mt-6 text-center text-sm">
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                    >
                        Iniciá sesión
                    </Link>
                </p>
            </section>
        </main>
    )
}