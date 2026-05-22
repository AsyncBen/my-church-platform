import { useState } from 'react'
import { Radio } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { ROLE_SCREENS } from '../../utils/media-constants'

interface LoginPageProps {
  onLogin: (role: Role) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('Media')
  const [loading, setLoading] = useState(false)

  const roles: { id: Role; label: string; desc: string }[] = [
    { id: 'Media', label: 'Media Team', desc: 'Broadcasting & sync' },
    { id: 'Pastor', label: 'Pastor', desc: 'Sermon & teaching' },
    { id: 'Secretary', label: 'Secretary', desc: 'Administration' },
    { id: 'Admin', label: 'Admin', desc: 'Full access' },
  ]

  const handleLogin = () => {
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(role)
    }, 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_40%)]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 mb-5 shadow-xl shadow-blue-500/25">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">My Church</h1>
          <p className="text-sm text-slate-400 mt-2">Media Control Dashboard</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="text-base font-semibold text-white mb-5">Sign in to your role</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`rounded-3xl p-3 text-left transition ${
                      role === r.id
                        ? 'bg-blue-600 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-semibold">{r.label}</div>
                    <div className="text-xs mt-1 text-slate-400">{r.desc}</div>
                  </button>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-mono text-slate-400">
                Access: {ROLE_SCREENS[role].filter((screen) => screen !== 'dashboard').map((screen) => screen.charAt(0).toUpperCase() + screen.slice(1)).join(' · ')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Email or Phone</label>
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@mychurch.org"
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            System online · Sunday 8:30 AM Service
          </span>
        </div>
      </div>
    </div>
  )
}
