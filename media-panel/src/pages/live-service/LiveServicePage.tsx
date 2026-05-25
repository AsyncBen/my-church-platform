import { useState } from 'react'
import { Search, Star, Edit3, ChevronUp, ChevronDown, Trash2, GripVertical, Zap, Play, Square, Send, Lock } from 'lucide-react'
import type { Role, QueueItem, Scripture, ActivityItem } from '../../types/media.types'
import type { ScriptureReference } from '../../types/scripture.types'
import { SCRIPTURES_DB, INITIAL_QUEUE, ACTIVITY_FEED } from '../../utils/media-data'
import { LiveDot } from '../../components/ui/LiveDot'
import { RoleBadge } from '../../components/ui/RoleBadge'
import { useScriptureSearch } from '../../hooks/useScriptureSearch'
import { useScriptureStore } from '../../store/scripture.store'
import { useAuthStore } from '../../store/auth.store'
import { socketService } from '../../services/socket'

interface LiveServicePageProps {
  role: Role
  liveActive: boolean
  setLiveActive: (active: boolean) => void
}

export default function LiveServicePage({ role, liveActive, setLiveActive }: LiveServicePageProps) {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE)
  const [activeIndex, setActiveIndex] = useState(0)
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults, clearSearch } = useScriptureSearch()
  const [activity, setActivity] = useState<ActivityItem[]>(ACTIVITY_FEED)
  const [broadcastFlash, setBroadcastFlash] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')
  const { broadcastScripture } = useScriptureStore()

  if (queue.length === 0) {
    setActiveIndex(0)
  }

  const activeItem = queue[activeIndex]

  const parseScriptureReference = (reference: string): ScriptureReference | null => {
    const [book, chapterVerse] = reference.split(' ')
    if (!chapterVerse) return null

    const [chapter, verse] = chapterVerse.split(':').map(Number)
    if (!book || Number.isNaN(chapter) || Number.isNaN(verse)) return null

    return { book, chapter, verse }
  }

  const activeReference = activeItem ? parseScriptureReference(activeItem.ref) : null

  const broadcast = (item?: QueueItem) => {
    const target = item || activeItem
    if (!target) return
    broadcastScripture(target.ref, target.text)
    setBroadcastFlash(true)
    window.setTimeout(() => setBroadcastFlash(false), 600)
    const newEntry: ActivityItem = {
      id: Date.now().toString(),
      type: 'scripture',
      message: `${target.ref} broadcast to congregation`,
      time: 'Just now',
    }
    setActivity((prev) => [newEntry, ...prev.slice(0, 7)])
    setQueue((prev) => prev.map((q) => (q.id === target.id ? { ...q, broadcast: true } : q)))
  }

  const addToQueue = (scripture: Scripture) => {
    if (queue.some((item) => item.ref === scripture.ref)) return
    setQueue((prev) => [...prev, { id: Date.now().toString(), ref: scripture.ref, text: scripture.text }])
    clearSearch()
  }

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id))
    setActiveIndex((prev) => Math.max(0, Math.min(prev, queue.length - 2)))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setQueue((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
    if (activeIndex === index) setActiveIndex(index - 1)
    else if (activeIndex === index - 1) setActiveIndex(index)
  }

  const moveDown = (index: number) => {
    if (index === queue.length - 1) return
    setQueue((prev) => {
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
    if (activeIndex === index) setActiveIndex(index + 1)
    else if (activeIndex === index + 1) setActiveIndex(index)
  }

  const goNext = () => {
    if (activeIndex < queue.length - 1) setActiveIndex((prev) => prev + 1)
  }

  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1)
  }

  const pushAnnouncement = () => {
    if (!announcementText.trim()) return
    socketService.emitAnnouncement({
      id: Date.now().toString(),
      title: 'Announcement',
      body: announcementText,
      postedBy: useAuthStore.getState().user?.name ?? 'Media',
      postedAt: new Date().toISOString(),
    })
    setActivity((prev) => [
      {
        id: Date.now().toString(),
        type: 'announcement',
        message: `Announcement: "${announcementText.slice(0, 40)}"`,
        time: 'Just now',
      },
      ...prev.slice(0, 7),
    ])
    setAnnouncementText('')
  }

  const canControlService = role === 'Admin' || role === 'Pastor'

  return (
    <div className="flex-1 overflow-hidden bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Live Control</h1>
          {liveActive && <LiveDot />}
          <RoleBadge role={role} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canControlService ? (
            liveActive ? (
              <button
                type="button"
                onClick={() => setLiveActive(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
              >
                <Square className="w-4 h-4" />
                End Service
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLiveActive(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
              >
                <Play className="w-4 h-4" />
                Start Service
              </button>
            )
          ) : (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              Service controls — Pastor/Admin only
            </div>
          )}

          <button
            type="button"
            onClick={() => broadcast()}
            disabled={!activeItem}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              broadcastFlash
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-blue-600 text-white shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500'
            }`}
          >
            <Zap className="w-4 h-4" />
            Broadcast Scripture
          </button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-96px)] grid-cols-3 overflow-hidden">
        <div className="col-span-2 overflow-auto border-r border-white/10">
          <div className={`mx-6 mt-5 rounded-[32px] border p-6 transition ${
            broadcastFlash
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : liveActive
              ? 'border-blue-500/25 bg-blue-600/10'
              : 'border-white/10 bg-white/5'
          }`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                {liveActive && <LiveDot />}
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-mono">Current Scripture</span>
              </div>
              <button type="button" className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white">
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
            <div className="text-sm font-semibold text-blue-300 mb-3">{activeItem?.ref || '—'}</div>
            <p className="text-xs text-slate-500 mb-4">{activeReference ? `${activeReference.book} ${activeReference.chapter}:${activeReference.verse}` : 'No scripture selected yet.'}</p>
            <p className="text-base leading-relaxed text-slate-200">{activeItem?.text || 'No scripture selected. Add scriptures to the queue below.'}</p>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={activeIndex >= queue.length - 1}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <span className="ml-auto text-xs font-mono text-slate-500">{queue.length === 0 ? 0 : activeIndex + 1} / {queue.length}</span>
            </div>
          </div>

          <div className="mx-6 mt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search scriptures — Romans, faith, love…"
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            {searchResults.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-lg shadow-black/20">
                {searchResults.map((scripture) => (
                  <button
                    key={scripture.id}
                    type="button"
                    onClick={() => addToQueue(scripture)}
                    className="w-full px-5 py-4 text-left transition hover:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-xs font-semibold text-blue-300">{scripture.ref}</span>
                      {scripture.favorite && <Star className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{scripture.text}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Favorites</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SCRIPTURES_DB.filter((scripture) => scripture.favorite).map((scripture) => (
                    <button
                      key={scripture.id}
                      type="button"
                      onClick={() => addToQueue(scripture)}
                      className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/15"
                    >
                      {scripture.ref}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(role === 'Pastor' || role === 'Admin') && (
            <div className="mx-6 mt-5 mb-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-3">Quick Announcement</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={announcementText}
                  onChange={(event) => setAnnouncementText(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && pushAnnouncement()}
                  placeholder="Type announcement and press Enter…"
                  className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                />
                <button
                  type="button"
                  onClick={pushAnnouncement}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto px-4 pt-5">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Sermon Queue</span>
              <span className="text-xs font-mono text-slate-500">{queue.length} items</span>
            </div>
            <div className="space-y-3">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-3xl border px-3 py-3 transition ${
                    index === activeIndex ? 'bg-blue-600/15 border-blue-500/25' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-mono text-slate-500 w-5 text-center">{index + 1}</span>
                  <GripVertical className="w-4 h-4 text-slate-500" />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${index === activeIndex ? 'text-blue-300' : 'text-white'}`}>{item.ref}</p>
                    {item.broadcast && <span className="text-xs text-emerald-300 font-mono">✓ sent</span>}
                  </div>
                  <div className="ml-auto flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                    <button type="button" onClick={(event) => { event.stopPropagation(); moveUp(index) }} className="rounded-full p-2 text-slate-400 hover:text-white">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); moveDown(index) }} className="rounded-full p-2 text-slate-400 hover:text-white">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); removeFromQueue(item.id) }} className="rounded-full p-2 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 pb-5 pt-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-4">Activity</p>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {activity.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    item.type === 'scripture'
                      ? 'bg-blue-400'
                      : item.type === 'announcement'
                      ? 'bg-amber-400'
                      : item.type === 'service'
                      ? 'bg-emerald-400'
                      : 'bg-purple-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200">{item.message}</p>
                    <p className="text-xs font-mono text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
