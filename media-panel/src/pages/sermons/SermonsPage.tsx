import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { INITIAL_SERMONS } from '../../utils/media-data'

interface SermonsPageProps {
  role: Role
}

export default function SermonsPage({ role }: SermonsPageProps) {
  const [sermons, setSermons] = useState(INITIAL_SERMONS)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSeries, setNewSeries] = useState('')
  const [newDate, setNewDate] = useState('')

  const canCreate = role === 'Pastor' || role === 'Admin'

  const createSermon = () => {
    if (!newTitle) return
    setSermons((prev) => [
      {
        id: Date.now().toString(),
        title: newTitle,
        series: newSeries || 'Untitled Series',
        pastor: 'Pastor James Adeyemi',
        date: newDate || '2024-12-15',
        scriptures: [],
        status: 'draft',
      },
      ...prev,
    ])
    setNewTitle('')
    setNewSeries('')
    setNewDate('')
    setCreating(false)
  }

  const statusColors = {
    draft: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    ready: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sermon Management</h1>
          <p className="text-sm text-slate-400 mt-1">Plan and organize sermon series and scripture queues</p>
        </div>
        {canCreate && (
          <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
            <Plus className="w-4 h-4" />
            New Sermon
          </button>
        )}
      </div>

      {creating && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold">New Sermon</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Sermon title"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <input
              value={newSeries}
              onChange={(event) => setNewSeries(event.target.value)}
              placeholder="Series name"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <input
              type="date"
              value={newDate}
              onChange={(event) => setNewDate(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={createSermon} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              Create Sermon
            </button>
            <button type="button" onClick={() => setCreating(false)} className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sermons.map((sermon) => (
          <div key={sermon.id} className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${statusColors[sermon.status]}`}>{sermon.status}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-[0.25em]">{sermon.series}</span>
                </div>
                <h2 className="text-lg font-semibold text-white">{sermon.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{sermon.pastor}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{sermon.date}</span>
                </div>
                {canCreate && <button type="button" className="mt-4 text-xs text-blue-300 opacity-0 transition group-hover:opacity-100">Edit →</button>}
              </div>
            </div>
            {sermon.scriptures.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {sermon.scriptures.map((reference) => (
                  <span key={reference} className="rounded-2xl border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-xs text-blue-300">{reference}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
