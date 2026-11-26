import { useCallback, useEffect, useState } from 'react'

interface AsyncState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

// Estados explícitos de interfaz: cargando, error y con datos.
// `reload` vuelve a pedir los datos (por ejemplo, desde un botón "Reintentar").
export function useAsync<T>(load: () => Promise<T>): AsyncState<T> & { reload: () => void } {
    const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let active = true
        load()
            .then((data) => active && setState({ data, loading: false, error: null }))
            .catch(
                (err) =>
                    active &&
                    setState({
                        data: null,
                        loading: false,
                        error: err instanceof Error ? err.message : 'No se pudieron cargar los datos.',
                    }),
            )
        return () => {
            active = false
        }
        // load es estable (función de módulo); se vuelve a ejecutar solo con reload()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attempt])

    const reload = useCallback(() => {
        setState({ data: null, loading: true, error: null })
        setAttempt((n) => n + 1)
    }, [])

    return { ...state, reload }
}
