import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { validateLogin, type LoginErrors } from '../../utils/validators'

export interface LoginFormValues {
    email: string
    password: string
}

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => Promise<void> | void
    isLoading?: boolean
    serverError?: string | null
    notice?: string | null // aviso informativo (ej. sesión vencida), no es un error
}

export function LoginForm({ onSubmit, isLoading = false, serverError, notice }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<LoginErrors>({})

    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors = validateLogin(email, password)
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        await onSubmit({ email: email.trim(), password })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {notice && (
                <p
                    role="status"
                    className="rounded-lg border border-turquoise bg-turquoise/10 px-4 py-3 text-sm font-semibold text-navy"
                >
                    {notice}
                </p>
            )}

            {serverError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-700 bg-white px-4 py-3 text-sm font-semibold text-red-700"
                >
                    {serverError}
                </p>
            )}

            <FormField
                label="Correo electrónico"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={handleEmail}
                error={errors.email}
            />

            <FormField
                label="Contraseña"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePassword}
                error={errors.password}
            />

            <Button type="submit" loading={isLoading}>
                Iniciar sesión
            </Button>
        </form>
    )
}