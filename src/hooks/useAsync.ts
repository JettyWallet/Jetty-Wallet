import { useEffect, useState } from 'react'

interface AsyncState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

// Estados explícitos de interfaz: cargando, error y con datos.
export function useAsync<T>(load: () => Promise<T>): AsyncState<T> {
    const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })

    useEffect(() => {
        let active = true
        load()
            .then((data) => active && setState({ data, loading: false, error: null }))
            .catch(() => active && setState({ data: null, loading: false, error: 'No se pudieron cargar los datos.' }))
        return () => {
            active = false
        }
        // load es estable (función de módulo); se ejecuta una sola vez al montar
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return state
}
