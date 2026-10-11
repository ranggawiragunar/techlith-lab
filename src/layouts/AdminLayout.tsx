import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context'
import { verificationValidationRoutes } from '../features/verificationValidation'

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isVerificationValidationPage = location.pathname.startsWith(verificationValidationRoutes.basePath)
  const isSession1Page = location.pathname === verificationValidationRoutes.session1Path

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark">T</div><div><strong>Techlith Lab</strong><span>{isVerificationValidationPage ? 'VERIFICATION & VALIDATION' : 'INVENTORY MANAGEMENT'}</span></div></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">◫</span>Dashboard</NavLink>
          <div className="nav-section-title">Inventory</div>
          <NavLink to="/admin/inventory/items" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">▦</span>Items</NavLink>
          <NavLink to="/admin/inventory/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">↺</span>Stock History</NavLink>
          <NavLink to="/admin/testing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">⚙</span>Testing Utilities</NavLink>
          <div className="nav-section-title">Classroom</div>
          <NavLink to={verificationValidationRoutes.basePath} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon" aria-hidden="true">▤</span>Verification &amp; Validation</NavLink>
        </nav>
        <div className="sidebar-footer"><div className="local-status"><span className="status-dot" />Local database active</div><span className="sidebar-version">{isSession1Page ? 'Context 01 · Session 1' : isVerificationValidationPage ? 'Context 00 · Foundation' : 'Foundation · Context 1'}</span></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Techlith Lab <span>/</span> {isVerificationValidationPage ? 'Verification & Validation' : 'Inventory Management Laboratory'}</div><div className="user-menu"><div className="avatar">{user?.displayName.charAt(0) ?? 'A'}</div><div className="user-label"><strong>{user?.displayName}</strong><span>Administrator</span></div><button className="button button-quiet logout-button" onClick={handleLogout}>Log out</button></div></header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
