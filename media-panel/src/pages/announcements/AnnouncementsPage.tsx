import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Trash2, Send } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { announcementService } from '../../services/announcement.service'
import { categoryColors } from '../../utils/media-constants'

interface AnnouncementsPageProps {
  role: Role
}

interface Announcement {
  id: string
  title: string
  body: string
  category: string
  isLive: boolean
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}

export default function AnnouncementsPage({ role }: AnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<string>('GENERAL')
  const [scheduled, setScheduled] = useState('')
  const [sending, setSending] = useState(false)

  const categories = ['GENERAL', 'EVENT', 'EMERGENCY', 'PRAYER', 'OFFERING']
  const canCompose = role === 'Pastor' || role === 'Admin' || role === 'Secretary'

  // Fetch announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await announcementService.getAll()
        setAnnouncements(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load announcements'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const pushAnnouncement = async () => {
    if (!title || !body) return
    setSending(true)
    try {
      await announcementService.create({
        title,
        body,
        category,
        scheduledAt: scheduled || undefined,
      })
      // Refetch to get the full list
      const data = await announcementService.getAll()
      setAnnouncements(data)
      // Clear form
      setTitle('')
      setBody('')
      setScheduled('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create announcement'
      alert(message)
    } finally {
      setSending(false)
    }
  }

  const handleSend = async (id: string) => {
    try {
      await announcementService.send(id)
      // Refetch to get updated list
      const data = await announcementService.getAll()
      setAnnouncements(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send announcement'
      alert(message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await announcementService.delete(id)
      // Refetch to get updated list
      const data = await announcementService.getAll()
      setAnnouncements(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete announcement'
      alert(message)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatCategory = (cat: string): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
  }

  const getCategoryColor = (cat: string): string => {
    const formatted = formatCategory(cat)
    return categoryColors[formatted] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'
  }

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading announcements...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <p className="text-sm text-slate-400 mt-1">Compose and push live announcements to the congregation</p>
      </div>

      {/* ── Error message ─────────────────────────────── */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Compose form ──────────────────────────────── */}
      {canCompose && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">New Announcement</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-2xl px-3 py-2 text-xs font-medium transition ${
                  category === item
                    ? getCategoryColor(item)
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {formatCategory(item)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Announcement title"
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write the announcement message for the congregation…"
              rows={4}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={scheduled}
                  onChange={(event) => setScheduled(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={pushAnnouncement}
                disabled={!title || !body || sending}
                className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Creating…' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Announcements list ────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Announcements</h2>
        <div className="space-y-3">
          {announcements.length === 0 && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No announcements yet.</p>
            </div>
          )}
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${getCategoryColor(announcement.category)}`}
                    >
                      {formatCategory(announcement.category)}
                    </span>
                    {announcement.isLive ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Sent {announcement.sentAt ? formatDate(announcement.sentAt) : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Draft</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{announcement.body}</p>
                  {announcement.scheduledAt && !announcement.isLive && (
                    <p className="text-xs text-slate-500 mt-2">
                      Scheduled: {formatDate(announcement.scheduledAt)}
                    </p>
                  )}
                </div>
                {canCompose && (
                  <div className="flex items-center gap-2">
                    {/* Send button — only show for unsent announcements */}
                    {!announcement.isLive && (
                      <button
                        type="button"
                        onClick={() => handleSend(announcement.id)}
                        className="rounded-2xl border border-emerald-500/30 p-3 text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10"
                        title="Send Now"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(announcement.id)}
                      className="rounded-2xl border border-white/10 p-3 text-slate-400 transition hover:border-red-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}