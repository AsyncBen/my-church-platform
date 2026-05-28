import { useState } from 'react'
import { Radio, AlertCircle } from 'lucide-react'
import type { Role } from '../../types/media.types'
import type { UserCredentials } from '../../types/auth.types'
import { ROLE_SCREENS } from '../../utils/media-constants'
import { isEmailOrPhone, isStrongPassword } from '../../utils/validators'
import { useAuthStore } from '../../store/auth.store'

interface LoginPageProps {
  onLogin: (role: Role) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState<UserCredentials>({ email: '', password: '' })
  const [selectedRole, setSelectedRole] = useState<Role>('Media')
  const [roleError, setRoleError] = useState('')
  const { isLoading, error, login } = useAuthStore()

  const validCredentials = isEmailOrPhone(credentials.email) && isStrongPassword(credentials.password)

  const roles: { id: Role; label: string; desc: string }[] = [
    { id: 'Media', label: 'Media Team', desc: 'Broadcasting & sync' },
    { id: 'Pastor', label: 'Pastor', desc: 'Sermon & teaching' },
    { id: 'Secretary', label: 'Secretary', desc: 'Administration' },
    { id: 'Admin', label: 'Admin', desc: 'Full access' },
  ]

  const handleLogin = async () => {
    if (!validCredentials) return
    setRoleError('')
    
    try {
      // Login first - this should set the user's actual role from the backend
      await login(credentials.email, credentials.password)
      
      // Get the user's actual role from the backend
      const actualRole = useAuthStore.getState().role as Role
      
      // Check if selected role matches the actual role
      if (selectedRole !== actualRole) {
        setRoleError(`You are registered as ${actualRole}. Please select the correct role.`)
        // Clear the auth state since login was invalid
        useAuthStore.getState().logout?.()
        return
      }
      
      // Role matches - proceed to dashboard
      onLogin(actualRole)
    } catch (err) {
      // Error is already handled in the store
      console.error('Login failed:', err)
    }
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setRoleError('') // Clear error when user changes selection
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

          {roleError && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{roleError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`rounded-3xl p-3 text-left transition ${
                      selectedRole === r.id
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
                Access: {ROLE_SCREENS[selectedRole].filter((screen) => screen !== 'dashboard').map((screen) => screen.charAt(0).toUpperCase() + screen.slice(1)).join(' · ')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Email or Phone</label>
              <input
                type="text"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@mychurch.org"
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
              {!isEmailOrPhone(credentials.email) && credentials.email.length > 0 ? (
                <p className="mt-2 text-xs text-amber-300">Enter a valid email address or phone number</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="••••••••"
                onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
              {error && error.length > 0 ? (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={!validCredentials || isLoading}
              className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
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