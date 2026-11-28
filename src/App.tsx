import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { DepositPage } from './pages/DepositPage'
import { ExchangePage } from './pages/ExchangePage'
import { HistoryPage } from './pages/HistoryPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
