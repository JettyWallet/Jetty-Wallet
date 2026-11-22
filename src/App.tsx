import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SectionPlaceholder } from './pages/SectionPlaceholder'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="wallets" element={<SectionPlaceholder title="Monedas" />} />
          <Route path="exchange" element={<SectionPlaceholder title="Operar" />} />
          <Route path="history" element={<SectionPlaceholder title="Historial" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
