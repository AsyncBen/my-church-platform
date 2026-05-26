import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import LiveServicePage from '../pages/live-service/LiveServicePage'
import SermonsPage from '../pages/sermons/SermonsPage'
import AnnouncementsPage from '../pages/announcements/AnnouncementsPage'
import FeedPage from '../pages/feed/FeedPage'
import MonitoringPage from '../pages/monitoring/MonitoringPage'
import GivingReportsPage from '../pages/giving/GivingReportsPage'
import type { Screen } from '../types/media.types'
import { ROLE_SCREENS } from '../utils/media-constants'
import { useLiveService } from '../hooks/useLiveService'
import { useAuthStore } from '../store/auth.store'
import { useServiceStore } from '../store/service.store'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const { role } = useAuthStore()
  const { isLive: liveActive, setLive: setLiveActive } = useLiveService()
  const connectedCount = useServiceStore((state) => state.connectedCount)

  const safeSetScreen = (next: Screen) => {
    if (ROLE_SCREENS[role].includes(next)) {
      setScreen(next)
    }
  }

  const handleLogin = () => {
    setScreen('dashboard')
  }

  if (screen === 'login') {
    return <LoginPage onLogin={handleLogin} />
  }

  const activeScreen = ROLE_SCREENS[role].includes(screen) ? screen : 'dashboard'

  return (
    <div className="h-screen min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="flex h-full overflow-hidden">
        <Sidebar screen={activeScreen} setScreen={safeSetScreen} role={role} liveActive={liveActive} onLogout={() => {
          useAuthStore.getState().logout()
          setScreen('login')
        }} />

        <main className="flex-1 overflow-hidden">
          {activeScreen === 'dashboard' && (
            <DashboardPage role={role} liveActive={liveActive} setScreen={safeSetScreen} connectedCount={connectedCount} />
          )}
          {activeScreen === 'live' && <LiveServicePage role={role} liveActive={liveActive} setLiveActive={setLiveActive} />}
          {activeScreen === 'sermons' && <SermonsPage role={role} />}
          {activeScreen === 'announcements' && <AnnouncementsPage role={role} />}
          {activeScreen === 'feed' && <FeedPage role={role} />}
          {activeScreen === 'monitoring' && <MonitoringPage />}
          {activeScreen === 'giving' && <GivingReportsPage role={role} />}
        </main>
      </div>
    </div>
  )
}