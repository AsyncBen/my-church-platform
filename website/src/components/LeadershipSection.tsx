import { Monitor, Bell, ListOrdered, Activity } from 'lucide-react'
import { FC } from 'react'

// Types
interface QueueItem {
  ref: string
  status: 'displayed' | 'next' | 'queued'
  active: boolean
}

interface FeatureCard {
  icon: string
  title: string
  desc: string
}

interface MetricItem {
  label: string
  val: string
  color: string
}

// Constants
const CHURCH_GOLD = '#C8962C'
const CHURCH_GOLD_LIGHT = '#E8B84D'

const queueItems: QueueItem[] = [
  { ref: 'John 3:16', status: 'displayed', active: true },
  { ref: 'Romans 8:28', status: 'next', active: false },
  { ref: 'Psalm 23:1', status: 'queued', active: false },
  { ref: 'Proverbs 3:5', status: 'queued', active: false },
]

const features: FeatureCard[] = [
  { icon: '🎬', title: 'Media Sync', desc: 'Broadcast content to all devices simultaneously with zero lag.' },
  { icon: '📣', title: 'Announcement Hub', desc: 'Send targeted broadcasts to the whole church or specific ministries.' },
  { icon: '📋', title: 'Sermon Queue', desc: 'Pre-load and manage your complete scripture queue before service.' },
  { icon: '📊', title: 'Live Monitoring', desc: 'See real-time engagement stats during the service as they happen.' },
]

const metrics: MetricItem[] = [
  { label: 'Viewing', val: '247', color: '#34D399' },
  { label: 'Notes open', val: '184', color: '#7EA8E8' },
  { label: 'Gave today', val: '63', color: CHURCH_GOLD },
]

// Dashboard Mockup Component
const DashboardMockup: FC = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: '#0F1C3F',
        border: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
            style={{ background: CHURCH_GOLD }}
          >
            ✝
          </div>
          <span className="text-white/80 text-sm font-semibold">Media Dashboard</span>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-3 text-white/40 text-xs">
          <Activity size={12} />
          <span>247 online</span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/5">
        {/* Scripture queue */}
        <div className="col-span-2 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ListOrdered size={14} style={{ color: CHURCH_GOLD }} />
            <span className="text-white/70 text-xs font-semibold">SCRIPTURE QUEUE</span>
          </div>
          <div className="space-y-2">
            {queueItems.map((item: QueueItem, i: number) => (
              <div
                key={item.ref}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{
                  background: item.active
                    ? 'rgba(200,150,44,0.15)'
                    : i === 1
                      ? 'rgba(61,107,196,0.1)'
                      : 'rgba(255,255,255,0.03)',
                  border: item.active
                    ? '1px solid rgba(200,150,44,0.3)'
                    : i === 1
                      ? '1px solid rgba(61,107,196,0.2)'
                      : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: item.active
                      ? CHURCH_GOLD
                      : i === 1
                        ? 'rgba(61,107,196,0.3)'
                        : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="flex-1 text-sm"
                  style={{ color: item.active ? CHURCH_GOLD_LIGHT : 'rgba(255,255,255,0.6)' }}
                >
                  {item.ref}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: item.active
                      ? 'rgba(200,150,44,0.2)'
                      : i === 1
                        ? 'rgba(61,107,196,0.2)'
                        : 'rgba(255,255,255,0.05)',
                    color: item.active
                      ? CHURCH_GOLD
                      : i === 1
                        ? '#7EA8E8'
                        : 'rgba(255,255,255,0.3)',
                    fontSize: 10,
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Push buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
              style={{ background: CHURCH_GOLD, color: '#fff' }}
            >
              ▶ Push Next
            </button>
            <button
              className="flex-1 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
            >
              + Add Verse
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="p-4 space-y-4">
          {/* Broadcast */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Bell size={12} style={{ color: '#F87171' }} />
              <span className="text-white/60 text-xs font-semibold">ANNOUNCEMENTS</span>
            </div>
            <div
              className="p-2.5 rounded-xl text-xs text-white/60"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="text-white/80 font-medium mb-1" style={{ fontSize: 11 }}>
                Volunteer Sign-Up
              </div>
              <div style={{ fontSize: 10 }}>Sent to 247 members</div>
              <div className="mt-1 flex items-center gap-1">
                <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: '73%', background: CHURCH_GOLD }} />
                </div>
                <span style={{ fontSize: 9, color: CHURCH_GOLD }}> 73%</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Activity size={12} style={{ color: '#34D399' }} />
              <span className="text-white/60 text-xs font-semibold">ENGAGEMENT</span>
            </div>
            {metrics.map((m: MetricItem) => (
              <div key={m.label} className="flex items-center justify-between py-1">
                <span className="text-white/40" style={{ fontSize: 10 }}>
                  {m.label}
                </span>
                <span className="font-bold text-xs" style={{ color: m.color }}>
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Leadership Section Component
export const LeadershipSection: FC = () => {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: 'linear-gradient(180deg, #EEF2FB 0%, #F8F9FC 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: 'rgba(27,58,122,0.08)',
              border: '1px solid rgba(27,58,122,0.15)',
              color: 'var(--church-blue)',
            }}
          >
            <Monitor size={14} />
            Leadership & Media Tools
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--foreground)',
              lineHeight: 1.2,
            }}
          >
            Built for the People
            <br />
            <em style={{ color: 'var(--church-blue)', fontStyle: 'italic' }}>Who Make It Happen</em>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            The media team gets a powerful, purpose-built dashboard to manage every aspect
            of the live service — without the complexity.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-3xl mx-auto mb-16">
          <DashboardMockup />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((card: FeatureCard) => (
            <div
              key={card.title}
              className="p-5 rounded-2xl text-center"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div
                className="font-semibold text-sm mb-2"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
              >
                {card.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LeadershipSection
