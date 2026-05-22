import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/live-service', label: 'Live Service' },
  { path: '/sermons', label: 'Sermons' },
  { path: '/announcements', label: 'Announcements' },
  { path: '/monitoring', label: 'Monitoring' },
  { path: '/giving', label: 'Giving' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Media Panel</div>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'active' : ''} end>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
