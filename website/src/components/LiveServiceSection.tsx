import { Wifi, Monitor, Smartphone, ChevronRight } from 'lucide-react'
import { FC } from 'react'

// Types
interface PhoneSyncProps {
  delay?: number
  verse?: string
}

interface StatItem {
  val: string
  label: string
}

// Constants
const CHURCH_GOLD = '#C8962C'
const CHURCH_GOLD_LIGHT = '#E8B84D'

const stats: StatItem[] = [
  { val: '<10ms', label: 'Sync latency' },
  { val: '10,000+', label: 'Simultaneous devices' },
  { val: '100%', label: 'Offline fallback' },
  { val: 'Zero', label: 'Setup for members' },
]

// Media Panel Component
const MediaPanel: FC = () => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#080F24',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        aspectRatio: '16/9',
        minWidth: 280,
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold">LIVE</span>
          <span className="text-white/30 text-xs mx-1">·</span>
          <span className="text-white/50 text-xs">Sunday Morning Service</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Wifi size={10} />
          <span>247 connected</span>
        </div>
      </div>

      {/* Scripture display */}
      <div className="flex flex-col items-center justify-center px-8 py-10">
        <div
          className="text-xs font-medium tracking-widest mb-4 uppercase"
          style={{ color: CHURCH_GOLD_LIGHT, opacity: 0.8 }}
        >
          📖 Current Verse
        </div>
        <blockquote
          className="text-center text-white leading-relaxed mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 1.4vw, 1.2rem)',
          }}
        >
          "Trust in the Lord with all your heart and lean not on your own understanding;
          in all your ways submit to him, and he will make your paths straight."
        </blockquote>
        <cite className="text-sm not-italic font-semibold" style={{ color: CHURCH_GOLD }}>
          Proverbs 3:5–6 · NIV
        </cite>
      </div>

      {/* Bottom queue */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center gap-3"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      >
        <span className="text-white/40 text-xs">Next:</span>
        {['Proverbs 3:7', 'Romans 8:28', 'Psalm 23:1'].map((v: string, i: number) => (
          <span
            key={v}
            className="px-2.5 py-0.5 rounded-full text-xs"
            style={{
              background: i === 0 ? 'rgba(200,150,44,0.3)' : 'rgba(255,255,255,0.06)',
              color: i === 0 ? CHURCH_GOLD_LIGHT : 'rgba(255,255,255,0.4)',
              border: i === 0 ? '1px solid rgba(200,150,44,0.4)' : 'none',
            }}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  )
}

// Phone Sync Component
const PhoneSync: FC<PhoneSyncProps> = ({ delay = 0, verse = 'Proverbs 3:5–6' }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl flex-shrink-0"
      style={{
        width: 120,
        height: 230,
        background: '#0F1C3F',
        border: '1.5px solid rgba(255,255,255,0.1)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="px-3 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
            }}
          >
            MY CHURCH
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>SYNC</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-3">
        <div
          className="rounded-lg p-2.5 mb-2"
          style={{ background: 'rgba(200,150,44,0.12)', border: '1px solid rgba(200,150,44,0.2)' }}
        >
          <div style={{ fontSize: 8, color: CHURCH_GOLD_LIGHT, marginBottom: 4 }}>📖 LIVE</div>
          <p
            className="text-white/90 leading-snug"
            style={{ fontSize: 8.5, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
          >
            "Trust in the Lord with all your heart..."
          </p>
          <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{verse}</div>
        </div>
        {/* Notes */}
        <div className="rounded-lg p-2 mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
            Sermon Notes
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)' }}>Tap to write...</div>
        </div>
        <div className="flex gap-1.5">
          <div
            className="flex-1 rounded-lg py-1.5 text-center"
            style={{ background: 'rgba(61,107,196,0.2)', fontSize: 8, color: '#7EA8E8' }}
          >
            📝 Notes
          </div>
          <div
            className="flex-1 rounded-lg py-1.5 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', fontSize: 8, color: 'rgba(255,255,255,0.4)' }}
          >
            💛 Give
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Live Service Section Component
export const LiveServiceSection: FC = () => {
  return (
    <section
      id="live-service"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0B1A40 0%, #1B3A7A 60%, #0F2455 100%)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(61,107,196,0.2) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: 'rgba(200,150,44,0.15)',
              border: '1px solid rgba(200,150,44,0.3)',
              color: CHURCH_GOLD_LIGHT,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Flagship Feature
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            The Entire Church,
            <br />
            <em style={{ color: CHURCH_GOLD_LIGHT }}>Perfectly in Sync</em>
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            When your media team advances a scripture on the main screen, every phone in the
            sanctuary updates instantly. No apps to manage — just one seamless experience.
          </p>
        </div>

        {/* Visual */}
        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">
          {/* Media panel */}
          <div className="w-full max-w-lg">
            <MediaPanel />
            <div className="flex items-center gap-2 mt-3 justify-center text-white/40 text-sm">
              <Monitor size={14} />
              Media Team Dashboard
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2 text-white/30">
            <div className="hidden lg:flex flex-col items-center gap-1">
              {[0, 1, 2].map((i: number) => (
                <ChevronRight
                  key={i}
                  size={20}
                  style={{
                    color: CHURCH_GOLD,
                    opacity: 1 - i * 0.3,
                    animationDelay: `${i * 150}ms`,
                  }}
                  className="animate-pulse"
                />
              ))}
            </div>
            <div className="flex lg:hidden flex-row items-center gap-1">
              {[0, 1, 2].map((i: number) => (
                <ChevronRight
                  key={i}
                  size={20}
                  style={{ color: CHURCH_GOLD, opacity: 1 - i * 0.3 }}
                  className="animate-pulse rotate-90"
                />
              ))}
            </div>
            <span className="text-xs text-white/40 text-center">&lt;10ms sync</span>
          </div>

          {/* Phones */}
          <div>
            <div className="flex items-end gap-3 justify-center">
              <PhoneSync delay={0} verse="Proverbs 3:5–6" />
              <PhoneSync delay={100} verse="Proverbs 3:5–6" />
              <PhoneSync delay={200} verse="Proverbs 3:5–6" />
            </div>
            <div className="flex items-center gap-2 mt-3 justify-center text-white/40 text-sm">
              <Smartphone size={14} />
              Congregation Phones
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
          {stats.map((s: StatItem) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: CHURCH_GOLD_LIGHT, fontFamily: 'var(--font-display)' }}
              >
                {s.val}
              </div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LiveServiceSection
