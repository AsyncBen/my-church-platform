import { useState } from 'react'
import { Download, Lock } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { GIVING_RECORDS } from '../../utils/media-data'

interface GivingReportsPageProps {
  role: Role
}

export default function GivingReportsPage({ role }: GivingReportsPageProps) {
  const [filter, setFilter] = useState<'all' | 'tithe' | 'offering' | 'special'>('all')
  const [search, setSearch] = useState('')

  const filtered = GIVING_RECORDS.filter((record) => {
    const matchesFilter = filter === 'all' || record.type === filter
    const matchesSearch =
      !search || record.name.toLowerCase().includes(search.toLowerCase()) || record.ref.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const total = filtered.reduce((sum, record) => sum + record.amount, 0)

  const typeColors = {
    tithe: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    offering: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    special: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  }

  const isViewOnly = role === 'Pastor'

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Giving Reports</h1>
            {isViewOnly && (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">
                <Lock className="w-3.5 h-3.5" />
                View Only
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">Sunday service and midweek giving submissions</p>
        </div>
        {!isViewOnly && (
          <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            label: 'Total Received',
            value: `₦${GIVING_RECORDS.reduce((sum, record) => sum + record.amount, 0).toLocaleString()}`,
            sub: `${GIVING_RECORDS.length} submissions`,
          },
          {
            label: 'Tithes',
            value: `₦${GIVING_RECORDS.filter((record) => record.type === 'tithe').reduce((sum, record) => sum + record.amount, 0).toLocaleString()}`,
            sub: `${GIVING_RECORDS.filter((record) => record.type === 'tithe').length} members`,
          },
          {
            label: 'Offerings & Special',
            value: `₦${GIVING_RECORDS.filter((record) => record.type !== 'tithe').reduce((sum, record) => sum + record.amount, 0).toLocaleString()}`,
            sub: `${GIVING_RECORDS.filter((record) => record.type !== 'tithe').length} submissions`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</div>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'tithe', 'offering', 'special'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                filter === option ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full max-w-sm">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or ref…"
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
            <Download className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-slate-950/50">
            <tr>
              {['Member', 'Amount', 'Type', 'Reference', 'Service', 'Date'].map((header) => (
                <th key={header} className="px-4 py-4 uppercase tracking-[0.25em] text-slate-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((record) => (
              <tr key={record.id} className="transition hover:bg-white/5">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-300 font-semibold">{record.name[0]}</div>
                    <span className="text-white">{record.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-white">₦{record.amount.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-2xl border px-2 py-1 text-xs font-semibold uppercase ${typeColors[record.type]}`}>{record.type}</span>
                </td>
                <td className="px-4 py-4 font-mono text-slate-400">{record.ref}</td>
                <td className="px-4 py-4 text-slate-400">{record.service}</td>
                <td className="px-4 py-4 text-slate-500 font-mono">{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-4 bg-slate-950/70">
          <span className="text-xs text-slate-500">{filtered.length} records</span>
          <span className="text-sm font-semibold text-white">Total: ₦{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
