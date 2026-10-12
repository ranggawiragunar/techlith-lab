import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'
import { AdminLayout } from '../layouts/AdminLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ItemsPage } from '../pages/ItemsPage'
import { ItemDetailPage } from '../pages/ItemDetailPage'
import { StockHistoryPage } from '../pages/StockHistoryPage'
import { TestingPage } from '../pages/TestingPage'
import { VerificationValidationPage, verificationValidationRoutes } from '../features/verificationValidation'
import { VerificationValidationSession1Page } from '../features/verificationValidation/pages/VerificationValidationSession1Page'
import { VerificationValidationSession2Page } from '../features/verificationValidation/pages/VerificationValidationSession2Page'
import { VerificationValidationSession3Page } from '../features/verificationValidation/pages/VerificationValidationSession3Page'
import { VerificationValidationSession4Page } from '../features/verificationValidation/pages/VerificationValidationSession4Page'
import { VerificationValidationSession5Page } from '../features/verificationValidation/pages/VerificationValidationSession5Page'
import { VerificationValidationSession6Page } from '../features/verificationValidation/pages/VerificationValidationSession6Page'

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
          <Route path={verificationValidationRoutes.nestedPath} element={<VerificationValidationPage />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[1]} element={<VerificationValidationSession1Page />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[2]} element={<VerificationValidationSession2Page />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[3]} element={<VerificationValidationSession3Page />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[4]} element={<VerificationValidationSession4Page />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[5]} element={<VerificationValidationSession5Page />} />
          <Route path={verificationValidationRoutes.sessionNestedPaths[6]} element={<VerificationValidationSession6Page />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}
