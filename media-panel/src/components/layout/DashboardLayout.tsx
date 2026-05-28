import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuthStore } from '../../store/auth.store'
import { useServiceStore } from '../../store/service.store'

export default function DashboardLayout() {
  const role = useAuthStore((state) => state.role)
  const isLive = useServiceStore((state) => state.isLive)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="dashboard-layout">
      <Sidebar 
        screen="dashboard"  // or get from router
        setScreen={(screen) => console.log(screen)}
        role={role}
        liveActive={isLive ?? false}
        onLogout={logout}
      />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}