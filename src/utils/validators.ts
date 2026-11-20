export interface LoginErrors {
    email?: string
    password?: string
}

export interface RegisterErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

export const MIN_PASSWORD_LENGTH = 8

// Chequeo simple de formato: algo@algo.algo, sin espacios.
export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateLogin(email: string, password: string): LoginErrors {
    const errors: LoginErrors = {}

    if (!email.trim()) {
        errors.email = 'Ingresá tu correo electrónico.'
    } else if (!isValidEmail(email.trim())) {
        errors.email = 'Ingresá un correo válido, por ejemplo nombre@correo.com.'
    }

    if (!password) {
        errors.password = 'Ingresá tu contraseña.'
    }

    return errors
}

export function validateRegister(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
): RegisterErrors {
    const errors: RegisterErrors = {}

    if (!name.trim()) {
        errors.name = 'Ingresá tu nombre.'
    }

    if (!email.trim()) {
        errors.email = 'Ingresá tu correo electrónico.'
    } else if (!isValidEmail(email.trim())) {
        errors.email = 'Ingresá un correo válido, por ejemplo nombre@correo.com.'
    }

    if (!password) {
        errors.password = 'Ingresá una contraseña.'
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Repetí tu contraseña.'
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    return errors
}