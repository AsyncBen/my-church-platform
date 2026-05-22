import { Navigate, useRoutes } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import LiveServicePage from '../pages/live-service/LiveServicePage'
import SermonsPage from '../pages/sermons/SermonsPage'
import AnnouncementsPage from '../pages/announcements/AnnouncementsPage'
import MonitoringPage from '../pages/monitoring/MonitoringPage'
import GivingReportsPage from '../pages/giving/GivingReportsPage'

function LoginRoute() {
  return <LoginPage onLogin={() => undefined} />
}

function DashboardRoute() {
  return <DashboardPage role="Media" liveActive={false} setScreen={() => undefined} connectedCount={0} />
}

function LiveServiceRoute() {
  return <LiveServicePage role="Media" liveActive={false} setLiveActive={() => undefined} />
}

function SermonsRoute() {
  return <SermonsPage role="Admin" />
}

function AnnouncementsRoute() {
  return <AnnouncementsPage role="Admin" />
}

function MonitoringRoute() {
  return <MonitoringPage connectedCount={0} liveActive={false} />
}

function GivingReportsRoute() {
  return <GivingReportsPage role="Admin" />
}

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardRoute /> },
      { path: 'live-service', element: <LiveServiceRoute /> },
      { path: 'sermons', element: <SermonsRoute /> },
      { path: 'announcements', element: <AnnouncementsRoute /> },
      { path: 'monitoring', element: <MonitoringRoute /> },
      { path: 'giving', element: <GivingReportsRoute /> },
    ],
  },
  { path: 'login', element: <LoginRoute /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

export function AppRouter() {
  return useRoutes(routes)
}
