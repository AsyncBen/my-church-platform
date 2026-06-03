import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FC } from 'react'

// Constants
const CHURCH_GOLD = '#C8962C'
const CHURCH_GOLD_LIGHT = '#E8B84D'
const CHURCH_BLUE_DARK = '#1B3A7A'
const BACKGROUND = '#080F24'

// Types
interface PhoneMockupProps {
  accent?: boolean
}

interface FeedItem {
  label: string
  icon: string
  sub: string
}

interface TrustSignal {
  num: string
  label: string
}

interface SyncDot {
  index: number
}

interface NavIcon {
  icon: string
  index: number
}

// Phone Mockup Component
const PhoneMockup: FC<PhoneMockupProps> = ({ accent = false }) => {
  const feedItems: FeedItem[] = [
    { label: 'Sermon Notes', icon: '📝', sub: 'Pastor Michael' },
    { label: 'Announcements', icon: '📣', sub: '2 new' },
    { label: 'Give', icon: '💛', sub: 'Quick & secure' },
  ]

  const navIcons: string[] = ['🏠', '📖', '👥', '🔔', '👤']

  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
      style={{
        width: 200,
        height: 400,
        background: accent ? CHURCH_BLUE_DARK : '#0F1C3F',
        border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: accent
          ? `0 32px 80px rgba(200,150,44,0.25), 0 8px 32px rgba(0,0,0,0.4)`
          : `0 32px 80px rgba(27,58,122,0.4), 0 8px 32px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-white/60 text-xs">9:41</span>
        <div
          className="w-20 h-4 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
        <div className="flex gap-1">
          <div className="w-4 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </div>

      {/* App header */}
      <div className="px-4 pt-2 pb-3 flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          style={{ background: CHURCH_GOLD }}
        >
          ✝
        </div>
        <span
          className="text-white text-sm font-semibold"
        >
          My Church
        </span>
      </div>

      {/* Scripture card */}
      <div
        className="mx-3 rounded-2xl p-4 mb-3"
        style={{
          background: accent
            ? 'rgba(200,150,44,0.15)'
            : 'rgba(61,107,196,0.2)',
          border: `1px solid ${accent ? 'rgba(200,150,44,0.3)' : 'rgba(61,107,196,0.3)'}`,
        }}
      >
        <div
          className="text-xs mb-1 font-medium"
          style={{ color: accent ? CHURCH_GOLD_LIGHT : '#7EA8E8' }}
        >
          📖 LIVE SCRIPTURE
        </div>
        <p
          className="text-white/90 leading-snug italic"
          style={{ fontSize: 11 }}
        >
          "For God so loved the world that he gave his one and only Son..."
        </p>
        <div className="text-white/50 mt-1" style={{ fontSize: 10 }}>
          John 3:16 · NIV
        </div>
      </div>

      {/* Live indicator */}
      <div className="mx-3 flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-300 text-xs font-medium">LIVE SERVICE</span>
        </div>
        <span className="text-white/40 text-xs">247 attending</span>
      </div>

      {/* Mini feed */}
      {feedItems.map((item: FeedItem) => (
        <div
          key={item.label}
          className="mx-3 mb-1.5 flex items-center gap-2.5 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          <div>
            <div className="text-white text-xs font-medium">{item.label}</div>
            <div className="text-white/40" style={{ fontSize: 10 }}>{item.sub}</div>
          </div>
        </div>
      ))}

      {/* Bottom nav bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-around px-2"
        style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {navIcons.map((icon: string, i: number) => (
          <button
            key={i}
            className="flex flex-col items-center gap-0.5 p-1"
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Hero Section Component
export const HeroSection: FC = () => {
  const trustSignals: TrustSignal[] = [
    { num: '2,400+', label: 'Churches' },
    { num: '1.2M', label: 'Congregation Members' },
    { num: '99.9%', label: 'Uptime' },
  ]

  const syncDots: number[] = [0, 1, 2]

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B1A40 0%, #1B3A7A 50%, #0F2455 100%)',
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(61,107,196,0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 30%, rgba(200,150,44,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
              style={{
                background: 'rgba(200,150,44,0.15)',
                border: '1px solid rgba(200,150,44,0.3)',
                color: CHURCH_GOLD_LIGHT,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Now Live — Realtime Church Technology
            </div>

            <h1
              className="text-white mb-6 leading-tight"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              One Connected
              <br />
              <span style={{ color: CHURCH_GOLD_LIGHT }}>Church Experience</span>
            </h1>

            <p
              className="text-white/70 mb-10 max-w-lg leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
            >
              My Church brings your entire congregation together — with realtime scripture
              synchronization, ministry communities, sermon notes, and seamless giving.
              One platform. One church. One purpose.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/church-onboarding"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  background: CHURCH_GOLD,
                  boxShadow: '0 4px 20px rgba(200,150,44,0.4)',
                }}
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
              >
                <Play size={16} />
                Explore Features
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap items-center gap-6">
              {trustSignals.map((signal: TrustSignal) => (
                <div key={signal.label}>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: CHURCH_GOLD_LIGHT }}
                  >
                    {signal.num}
                  </div>
                  <div className="text-white/50 text-sm">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockups */}
          <div className="relative flex justify-center items-end gap-6 mt-8 lg:mt-0">
            {/* Back phone */}
            <div className="translate-y-8 opacity-80">
              <PhoneMockup accent={false} />
            </div>
            {/* Front phone */}
            <div className="-translate-y-4">
              <PhoneMockup accent={true} />
            </div>

            {/* Floating sync indicator */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-white"
              style={{
                background: 'rgba(27,58,122,0.8)',
                border: '1px solid rgba(61,107,196,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex gap-1">
                {syncDots.map((i: number) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              Syncing 247 devices
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--background))',
        }}
      />
    </section>
  )
}

export default HeroSection
