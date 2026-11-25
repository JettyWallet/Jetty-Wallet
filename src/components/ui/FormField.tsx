import { useId, useState, type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M1.5 12S5 5 12 5c2.1 0 3.9.6 5.3 1.4M22.5 12S19 19 12 19c-2.1 0-3.9-.6-5.3-1.4M3 3l18 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function FormField({ label, error, id, type, ...props }: FormFieldProps) {
    const autoId = useId()
    const inputId = id ?? autoId
    const errorId = `${inputId}-error`

    const isPassword = type === 'password'
    const [visible, setVisible] = useState(false)
    const inputType = isPassword ? (visible ? 'text' : 'password') : type

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={inputId} className="text-sm font-semibold">
                {label}
            </label>
            <div className="relative">
                <input
                    id={inputId}
                    type={inputType}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-navy placeholder:text-navy/50 ${isPassword ? 'pr-12' : ''
                        } ${error ? 'border-red-700' : 'border-navy/40'}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((prev) => !prev)}
                        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-navy/60 hover:text-navy"
                    >
                        {visible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
            {error && (
                <p id={errorId} role="alert" className="text-sm font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    )
}