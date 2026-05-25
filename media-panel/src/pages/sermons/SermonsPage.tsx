import { useState, useEffect } from 'react'
import { Calendar, Plus, X, BookOpen } from 'lucide-react'
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
  const [newScriptures, setNewScriptures] = useState<string[]>([])
  const [scriptureInput, setScriptureInput] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [editingScripturesId, setEditingScripturesId] = useState<string | null>(null)
  const [editScriptureInput, setEditScriptureInput] = useState('')

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

  // ── Scripture helpers (create form) ─────────────────

  const addScriptureToNew = () => {
    const trimmed = scriptureInput.trim()
    if (!trimmed) return
    if (newScriptures.includes(trimmed)) {
      setScriptureInput('')
      return
    }
    setNewScriptures((prev) => [...prev, trimmed])
    setScriptureInput('')
  }

  const removeScriptureFromNew = (index: number) => {
    setNewScriptures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleScriptureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addScriptureToNew()
    }
  }

  // ── Scripture helpers (edit existing sermon) ────────

  const startEditingScriptures = (sermon: Sermon) => {
    setEditingScripturesId(sermon.id)
    setEditScriptureInput('')
  }

  const addScriptureToExisting = async (sermonId: string) => {
    const trimmed = editScriptureInput.trim()
    if (!trimmed) return

    const sermon = sermons.find((s) => s.id === sermonId)
    if (!sermon) return

    const currentList = sermon.scriptureList ?? []
    if (currentList.includes(trimmed)) {
      setEditScriptureInput('')
      return
    }

    const updatedList = [...currentList, trimmed]
    try {
      await sermonService.update(sermonId, { scriptureList: updatedList })
      const data = await sermonService.getAll()
      setSermons(data)
      setEditScriptureInput('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add scripture'
      alert(message)
    }
  }

  const removeScriptureFromExisting = async (sermonId: string, reference: string) => {
    const sermon = sermons.find((s) => s.id === sermonId)
    if (!sermon) return

    const updatedList = (sermon.scriptureList ?? []).filter((s) => s !== reference)
    try {
      await sermonService.update(sermonId, { scriptureList: updatedList })
      const data = await sermonService.getAll()
      setSermons(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove scripture'
      alert(message)
    }
  }

  const handleEditScriptureKeyDown = (e: React.KeyboardEvent, sermonId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addScriptureToExisting(sermonId)
    }
    if (e.key === 'Escape') {
      setEditingScripturesId(null)
      setEditScriptureInput('')
    }
  }

  // ── CRUD operations ─────────────────────────────────

  const createSermon = async () => {
    if (!newTitle) return
    try {
      await sermonService.create({
        title: newTitle,
        description: newDescription || undefined,
        scriptureList: newScriptures.length > 0 ? newScriptures : undefined,
      })
      const data = await sermonService.getAll()
      setSermons(data)
      setNewTitle('')
      setNewDescription('')
      setNewScriptures([])
      setScriptureInput('')
      setCreating(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create sermon'
      alert(message)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await sermonService.updateStatus(id, newStatus)
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
    DRAFT: 'px-3 py-1 bg-slate-500/15 text-slate-400 border border-slate-500/20 rounded-md',
    READY: 'px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-md',
    DELIVERED: 'px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-md',
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

          {/* ── Scripture input ────────────────────────── */}
          <div className="mt-4">
            <label className="text-xs text-slate-400 font-medium mb-2 block">
              Scripture References
            </label>
            <div className="flex gap-2">
              <input
                value={scriptureInput}
                onChange={(event) => setScriptureInput(event.target.value)}
                onKeyDown={handleScriptureKeyDown}
                placeholder="e.g. John 14:15–17"
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={addScriptureToNew}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 shrink-0"
              >
                Add
              </button>
            </div>
            {newScriptures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newScriptures.map((ref, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-xl border border-blue-500/30 bg-blue-600/15 px-3 py-1 text-xs text-blue-300"
                  >
                    {ref}
                    <button
                      type="button"
                      onClick={() => removeScriptureFromNew(index)}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-500/20 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              onClick={() => {
                setCreating(false)
                setNewScriptures([])
                setScriptureInput('')
              }}
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
            onMouseLeave={() => {
              setHoveredId(null)
              setEditingScripturesId(null)
            }}
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

            {/* ── Scripture list + editor ──────────────── */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-[0.15em]">
                    Scriptures
                  </span>
                </div>
                {canCreate && hoveredId === sermon.id && (
                  <button
                    type="button"
                    onClick={() => startEditingScriptures(sermon)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    + Add
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(sermon.scriptureList ?? []).map((reference) => (
                  <span
                    key={reference}
                    className="inline-flex items-center gap-1 rounded-xl border border-blue-500/20 bg-blue-600/10 px-3 py-1 text-xs text-blue-300"
                  >
                    {reference}
                    {canCreate && hoveredId === sermon.id && (
                      <button
                        type="button"
                        onClick={() => removeScriptureFromExisting(sermon.id, reference)}
                        className="ml-1 rounded-full p-0.5 hover:bg-blue-500/20 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {(sermon.scriptureList ?? []).length === 0 && (
                  <span className="text-xs text-slate-600 italic">No scriptures added yet</span>
                )}
              </div>

              {/* Inline add scripture input */}
              {editingScripturesId === sermon.id && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={editScriptureInput}
                    onChange={(event) => setEditScriptureInput(event.target.value)}
                    onKeyDown={(e) => handleEditScriptureKeyDown(e, sermon.id)}
                    placeholder="e.g. Psalm 23:1–6"
                    autoFocus
                    className="flex-1 rounded-xl border border-blue-500/30 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => addScriptureToExisting(sermon.id)}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}