import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'
import { AdminLayout } from '../layouts/AdminLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ItemsPage } from '../pages/ItemsPage'
import { ItemDetailPage } from '../pages/ItemDetailPage'
import { StockHistoryPage } from '../pages/StockHistoryPage'
import { TestingPage } from '../pages/TestingPage'
import { InventoryReportPage } from '../pages/InventoryReportPage'
import { Session3ClassroomPage } from '../pages/Session3ClassroomPage'
import { Session3BoundaryPage } from '../pages/Session3BoundaryPage'
import { Session3ProductPage } from '../pages/Session3ProductPage'
import { Session3SourcePage } from '../pages/Session3SourcePage'
import { Session3ClassroomLayout } from '../layouts/Session3ClassroomLayout'
import { Session4WorksheetPage } from '../pages/Session4WorksheetPage'

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
          <Route path="inventory/report" element={<InventoryReportPage />} />
          <Route path="testing" element={<TestingPage />} />
          <Route path="classroom/session-4" element={<Session4WorksheetPage />} />
          <Route path="classroom/session-3" element={<Session3ClassroomLayout />}>
            <Route index element={<Session3ClassroomPage />} />
            <Route path="boundary" element={<Session3BoundaryPage />} />
            <Route path="product" element={<Session3ProductPage />} />
            <Route path="source" element={<Session3SourcePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}
