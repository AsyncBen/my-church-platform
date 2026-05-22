import { useState } from 'react'
import { CheckCircle2, Clock, Trash2 } from 'lucide-react'
import type { Announcement, Role } from '../../types/media.types'
import { INITIAL_ANNOUNCEMENTS } from '../../utils/media-data'
import { categoryColors } from '../../utils/media-constants'

interface AnnouncementsPageProps {
  role: Role
}

export default function AnnouncementsPage({ role }: AnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<
    | 'General'
    | 'Event'
    | 'Emergency'
    | 'Prayer'
    | 'Offering'
  >('General')
  const [scheduled, setScheduled] = useState('')
  const [sending, setSending] = useState(false)

  const categories: Array<Announcement['category']> = ['General', 'Event', 'Emergency', 'Prayer', 'Offering']
  const canCompose = role === 'Pastor' || role === 'Admin' || role === 'Secretary'

  const pushAnnouncement = () => {
    if (!title || !body) return
    setSending(true)
    window.setTimeout(() => {
      setAnnouncements((prev) => [
        {
          id: Date.now().toString(),
          title,
          body,
          category,
          sent: true,
          time: 'Just now',
          scheduled: scheduled || undefined,
        },
        ...prev,
      ])
      setTitle('')
      setBody('')
      setScheduled('')
      setSending(false)
    }, 800)
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950 p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <p className="text-sm text-slate-400 mt-1">Compose and push live announcements to the congregation</p>
      </div>

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
                  category === item ? categoryColors[item] : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {item}
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
                {sending ? 'Pushing…' : 'Push to Congregation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${categoryColors[announcement.category]}`}>
                      {announcement.category}
                    </span>
                    {announcement.sent ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Sent {announcement.time}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Draft</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{announcement.body}</p>
                </div>
                {canCompose && (
                  <button type="button" className="rounded-2xl border border-white/10 p-3 text-slate-400 transition hover:border-red-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
