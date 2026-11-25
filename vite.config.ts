import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En desarrollo, todo lo que empiece con /api se reenvía al backend local.
    // El navegador cree que habla con el mismo dominio que la app (localhost:5173),
    // así la cookie httpOnly es de primera parte y no la bloquea.
    // La ruta se reenvía completa (con /api): las rutas del backend cuelgan de /api.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})