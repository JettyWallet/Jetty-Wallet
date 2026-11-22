import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { validateRegister, type RegisterErrors } from '../../utils/validators'

export interface RegisterFormValues {
    name: string
    email: string
    password: string
}

interface RegisterFormProps {
    onSubmit: (values: RegisterFormValues) => Promise<void> | void
    isLoading?: boolean
    serverError?: string | null
}

export function RegisterForm({ onSubmit, isLoading = false, serverError }: RegisterFormProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<RegisterErrors>({})

    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
    }

    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
    }

    const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const newErrors = validateRegister(name, email, password, confirmPassword)
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        // confirmPassword solo sirve para validar: no se envía al backend.
        await onSubmit({ name: name.trim(), email: email.trim(), password })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {serverError && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-700 bg-white px-4 py-3 text-sm font-semibold text-red-700"
                >
                    {serverError}
                </p>
            )}

            <FormField
                label="Nombre"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Tu nombre"
                value={name}
                onChange={handleName}
                error={errors.name}
            />

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
                autoComplete="new-password"
                value={password}
                onChange={handlePassword}
                error={errors.password}
            />

            <FormField
                label="Repetir contraseña"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                error={errors.confirmPassword}
            />

            <Button type="submit" loading={isLoading}>
                Crear cuenta
            </Button>
        </form>
    )
}