import { Navigate, useRoutes } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import LiveServicePage from '../pages/live-service/LiveServicePage'
import SermonsPage from '../pages/sermons/SermonsPage'
import AnnouncementsPage from '../pages/announcements/AnnouncementsPage'
import MonitoringPage from '../pages/monitoring/MonitoringPage'
import GivingReportsPage from '../pages/giving/GivingReportsPage'

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'live-service', element: <LiveServicePage /> },
      { path: 'sermons', element: <SermonsPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'monitoring', element: <MonitoringPage /> },
      { path: 'giving', element: <GivingReportsPage /> },
    ],
  },
  { path: 'login', element: <LoginPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

export function AppRouter() {
  return useRoutes(routes)
}
