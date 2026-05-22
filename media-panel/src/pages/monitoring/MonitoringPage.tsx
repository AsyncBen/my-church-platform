import { useEffect, useState } from 'react'
import { Activity, BookOpen, Radio, Wifi, Calendar } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { ACTIVITY_FEED } from '../../utils/media-data'
import { LiveDot } from '../../components/ui/LiveDot'

interface MonitoringPageProps {
  connectedCount: number
  liveActive: boolean
}

export default function MonitoringPage({ connectedCount, liveActive }: MonitoringPageProps) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick((prev) => prev + 1), 3000)
    return () => window.clearInterval(intervalId)
  }, [])

  const health = liveActive ? 98 : 0
  const regions = [
    { name: 'Main Sanctuary', devices: 142, synced: 141, status: 'healthy' },
    { name: 'Youth Hall', devices: 48, synced: 47, status: 'healthy' },
    { name: 'Overflow Room', devices: 24, synced: 22, status: 'warning' },
    { name: 'Online Viewers', devices: 312, synced: 312, status: 'healthy' },
  ]

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Live Monitoring</h1>
        <p className="text-sm text-slate-400 mt-1">Realtime congregation synchronization overview</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Devices', value: liveActive ? connectedCount : '—', icon: Wifi, color: 'text-blue-400' },
          { label: 'Service Status', value: liveActive ? 'Live' : 'Offline', icon: Radio, color: liveActive ? 'text-emerald-400' : 'text-slate-500' },
          { label: 'Sync Health', value: liveActive ? `${health}%` : '—', icon: Activity, color: 'text-purple-400' },
          { label: 'Current Scripture', value: 'Rom 8:28', icon: BookOpen, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {liveActive && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Synchronization Health</h2>
            <span className="text-xs font-mono text-emerald-400">{health}% synchronized</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all" style={{ width: `${health}%` }} />
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold mb-4">Device Regions</h2>
        <div className="space-y-3">
          {regions.map((region) => (
            <div key={region.name} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white font-semibold">{region.name}</p>
                  <p className="text-xs text-slate-500">{region.synced}/{region.devices} synced</p>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${region.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${region.status === 'healthy' ? 'bg-emerald-500/60' : 'bg-amber-500/60'}`} style={{ width: `${(region.synced / region.devices) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Sync Events</h2>
          {liveActive && <LiveDot />}
        </div>
        <div className="space-y-3">
          {ACTIVITY_FEED.map((item) => (
            <div key={item.id} className="flex items-center gap-3 text-sm text-slate-200">
              <span className="w-20 text-xs font-mono text-slate-500">{item.time}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${
                item.type === 'scripture'
                  ? 'bg-blue-400'
                  : item.type === 'announcement'
                  ? 'bg-amber-400'
                  : item.type === 'service'
                  ? 'bg-emerald-400'
                  : 'bg-purple-400'
              }`} />
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
