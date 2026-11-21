import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm, type LoginFormValues } from '../components/auth/LoginForm'
import { Button } from '../components/ui/Button'

interface LocationState {
    from?: { pathname: string }
}

export function LoginPage() {
    const { status, error, login, loginWithGoogle, clearError } = useAuth()
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
        <main className="flex min-h-screen items-center justify-center bg-cream p-6 text-navy">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-bold">Iniciá sesión</h1>
                <p className="mb-6 text-sm text-navy/80">
                    Entrá a tu billetera Jetty Wallet.
                </p>

                <LoginForm onSubmit={handleSubmit} isLoading={isLoading} serverError={error} />

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
                    ¿No tenés cuenta?{' '}
                    <Link to="/register" className="font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
                        Registrate
                    </Link>
                </p>
            </section>
        </main>
    )
}