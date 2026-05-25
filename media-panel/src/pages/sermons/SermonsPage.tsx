import { useState, useEffect } from 'react'
import { Calendar, Plus } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { sermonService } from '../../services/sermon.service'

interface SermonsPageProps {
  role: Role
}

interface Sermon {
  id: string
  title: string
  description?: string
  status: 'DRAFT' | 'READY' | 'DELIVERED'
  scriptureList?: string[]
  queue?: string[]
  createdAt: string
  updatedAt: string
}

export default function SermonsPage({ role }: SermonsPageProps) {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const canCreate = role === 'Pastor' || role === 'Admin'

  // Fetch sermons on mount
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await sermonService.getAll()
        setSermons(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load sermons'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [])

  const createSermon = async () => {
    if (!newTitle) return
    try {
      await sermonService.create({
        title: newTitle,
        description: newDescription || undefined,
      })
      // Refetch to get the full list
      const data = await sermonService.getAll()
      setSermons(data)
      setNewTitle('')
      setNewDescription('')
      setCreating(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create sermon'
      alert(message)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await sermonService.updateStatus(id, newStatus)
      // Refetch to get updated list
      const data = await sermonService.getAll()
      setSermons(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status'
      alert(message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    READY: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    DELIVERED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }

  const statusLabel: Record<string, string> = {
    DRAFT: 'draft',
    READY: 'ready',
    DELIVERED: 'delivered',
  }

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading sermons...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sermon Management</h1>
          <p className="text-sm text-slate-400 mt-1">Plan and organize sermon series and scripture queues</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus className="w-4 h-4" />
            New Sermon
          </button>
        )}
      </div>

      {/* ── Error message ─────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Create form ───────────────────────────────── */}
      {creating && (
        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold">New Sermon</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder="Sermon title"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <input
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              placeholder="Description (optional)"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={createSermon}
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Create Sermon
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Sermons list ──────────────────────────────── */}
      <div className="grid gap-4">
        {sermons.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No sermons yet. Create your first sermon to get started.</p>
          </div>
        )}
        {sermons.map((sermon) => (
          <div
            key={sermon.id}
            className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20"
            onMouseEnter={() => setHoveredId(sermon.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {/* Status badge with hover dropdown */}
                  <div className="relative">
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${statusColors[sermon.status]}`}
                    >
                      {statusLabel[sermon.status] || sermon.status.toLowerCase()}
                    </span>
                    {canCreate && hoveredId === sermon.id && (
                      <div className="absolute top-full left-0 mt-1 z-10 flex gap-1 rounded-2xl border border-white/10 bg-slate-900 p-1 shadow-xl">
                        {(['DRAFT', 'READY', 'DELIVERED'] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateStatus(sermon.id, status)}
                            className={`rounded-xl px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                              sermon.status === status
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {statusLabel[status]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {sermon.description && (
                    <span className="text-xs text-slate-500 uppercase tracking-[0.25em]">{sermon.description}</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-white">{sermon.title}</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Created {formatDate(sermon.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(sermon.updatedAt)}</span>
                </div>
              </div>
            </div>
            {sermon.scriptureList && sermon.scriptureList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {sermon.scriptureList.map((reference) => (
                  <span
                    key={reference}
                    className="rounded-2xl border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-xs text-blue-300"
                  >
                    {reference}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}