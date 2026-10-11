import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context'

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!['/admin/classroom/session-5', '/admin/classroom/session-6'].includes(location.pathname)) return

    function revealActiveMobileLink() {
      if (!window.matchMedia('(max-width: 680px)').matches) return

      const nav = document.querySelector<HTMLElement>('.side-nav')
      const activeLink = nav?.querySelector<HTMLElement>('.nav-link.active')
      if (!nav || !activeLink) return

      const navBounds = nav.getBoundingClientRect()
      const linkBounds = activeLink.getBoundingClientRect()
      nav.scrollTo({ left: nav.scrollLeft + linkBounds.left - navBounds.left - 12 })
    }

    revealActiveMobileLink()
    window.addEventListener('resize', revealActiveMobileLink)
    return () => window.removeEventListener('resize', revealActiveMobileLink)
  }, [location.pathname])

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark">T</div><div><strong>Techlith Lab</strong><span>SOFTWARE TESTING</span></div></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">◫</span>Dashboard</NavLink>
          <div className="nav-section-title">Inventory</div>
          <NavLink to="/admin/inventory/items" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">▦</span>Items</NavLink>
          <NavLink to="/admin/inventory/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">↺</span>Stock History</NavLink>
          <NavLink to="/admin/inventory/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">▤</span>Inventory Report</NavLink>
          <div className="nav-section-title">Classroom Labs</div>
          <NavLink to="/admin/classroom/session-3" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">▣</span>Session 3 — Inventory Testing</NavLink>
          <NavLink to="/admin/classroom/session-4" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon" aria-hidden="true">◎</span>Session 4 — Object-Oriented Testing</NavLink>
          <NavLink to="/admin/classroom/session-5" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon" aria-hidden="true">⇄</span>Sesi 5 — Integration Testing</NavLink>
          <NavLink to="/admin/classroom/session-6" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon" aria-hidden="true">✓</span>Sesi 6 — System Acceptance</NavLink>
          <NavLink to="/admin/testing" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">⚙</span>Testing Utilities</NavLink>
        </nav>
        <div className="sidebar-footer"><div className="local-status"><span className="status-dot" />Local database active</div><span className="sidebar-version">Foundation · Context 1</span></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Software Testing <span>/</span> Laboratory</div><div className="user-menu"><div className="avatar">{user?.displayName.charAt(0) ?? 'A'}</div><div className="user-label"><strong>{user?.displayName}</strong><span>Administrator</span></div><button className="button button-quiet logout-button" onClick={handleLogout}>Log out</button></div></header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
