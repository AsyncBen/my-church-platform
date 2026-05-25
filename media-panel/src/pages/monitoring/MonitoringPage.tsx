import { useEffect, useState } from 'react'
import { Activity, BookOpen, Radio, Wifi, Calendar } from 'lucide-react'
import type { ServiceStatus } from '../../types/service.types'
import { ACTIVITY_FEED } from '../../utils/media-data'
import { LiveDot } from '../../components/ui/LiveDot'
import { useServiceStore } from '../../store/service.store'
import { useScriptureStore } from '../../store/scripture.store'

export default function MonitoringPage() {
  const [tick, setTick] = useState(0)
  const { isLive, connectedCount, syncHealth, deviceRegions } = useServiceStore()
  const { lastBroadcast, activityLog } = useScriptureStore()

  useEffect(() => {
    const intervalId = window.setInterval(() => setTick((prev) => prev + 1), 3000)
    return () => window.clearInterval(intervalId)
  }, [])

  const serviceStatus: ServiceStatus = {
    isLive: isLive ?? false,
    viewerCount: connectedCount,
  }

  const feedToShow = activityLog.length > 0 ? activityLog : ACTIVITY_FEED
  const health = serviceStatus.isLive ? syncHealth : 0

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Live Monitoring</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Updated {tick * 3}s ago</span>
        </div>
        <p className="text-sm text-slate-400 mt-1">Realtime congregation synchronization overview</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Devices', value: serviceStatus.isLive ? connectedCount : '—', icon: Wifi, color: 'text-blue-400' },
          { label: 'Service Status', value: serviceStatus.isLive ? 'Live' : 'Offline', icon: Radio, color: serviceStatus.isLive ? 'text-emerald-400' : 'text-slate-500' },
          { label: 'Sync Health', value: serviceStatus.isLive ? `${health}%` : '—', icon: Activity, color: 'text-purple-400' },
          { label: 'Current Scripture', value: lastBroadcast?.reference ?? '—', icon: BookOpen, color: 'text-amber-400' },
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

      {serviceStatus.isLive && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Synchronization Health</h2>
            <span className="text-xs font-mono text-emerald-400">{health}% synchronized</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000" style={{ width: `${health}%` }} />
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold mb-4">Device Regions</h2>
        <div className="space-y-3">
          {deviceRegions.map((region) => (
            <div key={region.name} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white font-semibold">{region.name}</p>
                  <p className="text-xs text-slate-500">{region.synced}/{region.devices} synced</p>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${
                  region.status === 'healthy' ? 'bg-emerald-400' : 
                  region.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${
                  region.status === 'healthy' ? 'bg-emerald-500/60' : 
                  region.status === 'warning' ? 'bg-amber-500/60' : 'bg-red-500/60'
                }`} style={{ width: `${region.devices > 0 ? (region.synced / region.devices) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Sync Events</h2>
          {serviceStatus.isLive && <LiveDot />}
        </div>
        <div className="space-y-3">
          {feedToShow.map((item) => {
            const colors: Record<string, string> = {
              scripture: 'bg-blue-400',
              announcement: 'bg-amber-400',
              service: 'bg-emerald-400',
              sync: 'bg-purple-400',
            }
            return (
              <div key={item.id} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-20 text-xs font-mono text-slate-500">{item.time}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  colors[item.type] ?? 'bg-slate-400'
                }`} />
                <span>{item.message}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}