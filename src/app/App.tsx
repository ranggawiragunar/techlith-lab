import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'
import { AdminLayout } from '../layouts/AdminLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ItemsPage } from '../pages/ItemsPage'
import { ItemDetailPage } from '../pages/ItemDetailPage'
import { StockHistoryPage } from '../pages/StockHistoryPage'
import { TestingPage } from '../pages/TestingPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<Navigate to="items" replace />} />
          <Route path="inventory/items" element={<ItemsPage />} />
          <Route path="inventory/items/:itemCode" element={<ItemDetailPage />} />
          <Route path="inventory/history" element={<StockHistoryPage />} />
          <Route path="testing" element={<TestingPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}
