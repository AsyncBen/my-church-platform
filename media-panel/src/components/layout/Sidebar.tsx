import { LogOut, Radio } from 'lucide-react'
import type { Screen, Role } from '../../types/media.types'
import { ALL_NAV, ROLE_META, ROLE_SCREENS } from '../../utils/media-constants'
import { LiveDot } from '../ui/LiveDot'

interface SidebarProps {
  screen: Screen
  setScreen: (screen: Screen) => void
  role: Role
  liveActive: boolean
  onLogout: () => void
}

export default function Sidebar({ screen, setScreen, role, liveActive, onLogout }: SidebarProps) {
  const allowedNav = ALL_NAV.filter((nav) => ROLE_SCREENS[role].includes(nav.id))
  const meta = ROLE_META[role]

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-950 border-r border-white/10">
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-blue-500/20 shadow-lg">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">My Church</p>
            <p className="text-xs text-slate-500">Media Control</p>
          </div>
        </div>
        <div className="mt-4">
          {liveActive && ROLE_SCREENS[role].includes('live') ? (
            <LiveDot />
          ) : (
            <p className="text-xs text-slate-500 font-mono">{liveActive ? 'Service Live' : 'Standby'}</p>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {allowedNav.map(({ id, label, icon: Icon }) => {
          const active = screen === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setScreen(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${
                active
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-blue-300' : 'text-slate-500'}`} />
              <span className="text-left">{label}</span>
              {id === 'live' && liveActive && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <div className="px-3 py-2 rounded-2xl bg-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              role === 'Admin'
                ? 'bg-emerald-600/30 text-emerald-300'
                : role === 'Pastor'
                ? 'bg-amber-600/30 text-amber-300'
                : role === 'Secretary'
                ? 'bg-purple-600/30 text-purple-300'
                : 'bg-blue-600/30 text-blue-300'
            }`}>
              {meta.label[0]}
            </div>
            <div>
              <p className="text-xs font-semibold text-white truncate">{meta.label}</p>
              <p className="text-[11px] text-slate-500 truncate">{meta.description}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border ${meta.badge}`}>{meta.label}</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
