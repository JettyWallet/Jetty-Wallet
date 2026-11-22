# Jetty Wallet

Billetera virtual multimoneda (USD, EUR, COP, ARS). Este repositorio contiene el **frontend**: una SPA que permite registrarse, iniciar sesión y operar desde un dashboard.

> Proyecto académico. Los fondos son **simulados**.

## Estado del proyecto

| Sprint | Alcance | Estado |
|---|---|---|
| 1 – Fundamentos y demo | Login, registro y dashboard inicial | En curso (Demo 1) |
| 2 – Funcionalidad core | Multi-moneda, compra/venta/intercambio, historial, chatbot, tests | Pendiente |

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router 7
- lucide-react (iconos)

## Cómo correrlo

Requisitos: Node.js 20.19 o superior (o 22.12 o superior).

```bash
git clone https://github.com/jettywallet/jetty-wallet.git
cd jetty-wallet
git checkout dev
npm install
cp .env.example .env
npm run dev
```

La app queda en http://localhost:5173.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:3000` |
| `VITE_USE_MOCK` | `true` usa el servicio de auth simulado; `false` usa el backend real | `true` |

Con `VITE_USE_MOCK=true` no hace falta backend. Usuario de prueba:

- **Correo:** `demo@jetty.com`
- **Contraseña:** `12345678`

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Revisa tipos y genera la versión de producción |
| `npm run lint` | Corre ESLint |
| `npm run preview` | Sirve el build localmente |

## Estructura

```
src/
├── components/
│   ├── auth/        # Formularios de login y registro
│   ├── dashboard/   # Layout, balance, monedas, acciones y movimientos
│   └── ui/          # Componentes base (Button, FormField)
├── context/         # AuthProvider y estado de sesión
├── hooks/           # useAuth, useAsync
├── pages/           # Una página por ruta
├── routes/          # ProtectedRoute
├── services/        # Acceso a datos (mock y real)
├── types/           # Tipos compartidos con el contrato de la API
└── utils/           # Formato de montos y fechas
```

### Rutas

| Ruta | Acceso | Pantalla |
|---|---|---|
| `/login`, `/register` | Pública | Autenticación |
| `/dashboard` | Protegida | Resumen de la billetera |
| `/dashboard/wallets`, `/exchange`, `/history` | Protegida | Placeholders del Sprint 2 |

### Mock y backend real

Los servicios siguen un mismo contrato, para cambiar de mock a backend sin tocar la interfaz:

- **Auth:** `authService.mock.ts` y `authService.real.ts`, elegidos con `VITE_USE_MOCK`.
- **Billetera:** `walletService.ts` hoy es un mock; cuando el backend tenga los endpoints se agrega `walletService.real.ts` con el contrato `WalletService` (`src/types/wallet.ts`).

## Diseño

| Color | Hex | Uso |
|---|---|---|
| Navy | `#0b2a4a` | Sidebar, tarjeta de balance, textos |
| Turquesa | `#19b5a5` | Elemento activo, acciones positivas |
| Coral | `#ff7a59` | Acciones de venta, alertas |
| Crema | `#f6f3ec` | Fondo |

Tipografía: Sora. Los colores y la fuente se definen en `src/index.css`.

## Flujo de trabajo

- La rama de integración es `dev`. No se trabaja directo en ella.
- Cada tarea va en una rama propia (`feat/...`, `fix/...`, `chore/...`, `docs/...`) y se integra con un Pull Request hacia `dev`.
- Antes de abrir el PR: `npm run build` y `npm run lint` deben pasar.

## Despliegue

- Frontend: Vercel. `vercel.json` redirige todas las rutas a `index.html` para que las rutas de React Router funcionen al recargar.
- Backend: Railway.

URL de producción: _pendiente de completar_.
