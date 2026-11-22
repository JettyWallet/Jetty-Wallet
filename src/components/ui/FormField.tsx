import { useId, type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export function FormField({ label, error, id, ...props }: FormFieldProps) {
    const autoId = useId()
    const inputId = id ?? autoId
    const errorId = `${inputId}-error`

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={inputId} className="text-sm font-semibold">
                {label}
            </label>
            <input
                id={inputId}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`rounded-lg border bg-white px-4 py-3 text-navy placeholder:text-navy/50 ${error ? 'border-red-700' : 'border-navy/40'
                    }`}
                {...props}
            />
            {error && (
                <p id={errorId} role="alert" className="text-sm font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    )
}