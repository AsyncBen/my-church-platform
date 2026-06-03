import { CheckCircle, ArrowRight, Users, Zap, Monitor, Heart, Shield, BarChart3 } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router'
import { PageLayout, PageHero } from '../components/Layout'

// Types
interface BenefitCard {
  icon: React.ElementType
  title: string
  desc: string
  color: string
  bg: string
}

interface ChurchType {
  emoji: string
  label: string
  sub: string
}

// Constants
const benefits: BenefitCard[] = [
  {
    icon: Zap,
    title: 'Instant Scripture Sync',
    desc: 'Every verse your pastor advances on the main screen appears on every congregation member\'s device in under 10ms. Zero friction, maximum impact.',
    color: 'var(--church-blue-light)',
    bg: 'rgba(61,107,196,0.08)',
  },
  {
    icon: Users,
    title: 'Ministry Coordination',
    desc: 'Give each ministry team their own private hub — for messaging, scheduling, and staying connected between Sundays.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
  {
    icon: Monitor,
    title: 'Powerful Media Dashboard',
    desc: 'Your media team gets a purpose-built dashboard to manage the entire live service — scripture queues, announcements, and live engagement monitoring.',
    color: 'var(--church-blue)',
    bg: 'rgba(27,58,122,0.08)',
  },
  {
    icon: Heart,
    title: 'Simplified Giving',
    desc: 'Congregants can give in seconds with a beautiful, church-friendly flow. No fintech friction — just generosity made easy.',
    color: 'var(--church-gold)',
    bg: 'rgba(200,150,44,0.08)',
  },
  {
    icon: Shield,
    title: 'Built for Trust',
    desc: 'Every piece of data is encrypted, hosted on secure infrastructure, and governed by policies your congregation can trust.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Leadership Insights',
    desc: 'Track giving trends, service engagement, and community growth — all from one clean dashboard designed for church leadership.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.08)',
  },
]

const included: string[] = [
  'Congregation mobile app (iOS & Android)',
  'Realtime scripture synchronization',
  'Ministry community channels',
  'Sermon notes & archive',
  'Church feed & announcements',
  'Giving management & fund tracking',
  'Media team dashboard',
  'Push notifications',
  'Member directory',
  'Onboarding support',
]

const churchTypes: ChurchType[] = [
  { emoji: '⛪', label: 'Small Churches', sub: 'Under 100 members' },
  { emoji: '🏛️', label: 'Mid-size Churches', sub: '100–500 members' },
  { emoji: '🌐', label: 'Large Churches', sub: '500–5,000 members' },
  { emoji: '🏢', label: 'Multi-campus', sub: 'Multiple locations' },
]

// Component
export const ForChurchesPage: FC = () => {
  return (
    <PageLayout>
      <PageHero
        badge="Built for Every Church"
        title={
          <>
            Technology Designed
            <br />
            <em style={{ color: 'var(--church-gold-light)' }}>For Ministry, Not Startups</em>
          </>
        }
        subtitle="My Church is built from the ground up for how churches actually operate — from Sunday morning service to midweek small groups."
      />

      {/* For every church type */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {churchTypes.map((c: ChurchType) => (
              <div
                key={c.label}
                className="text-center py-8 px-4 rounded-2xl"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="text-4xl mb-3">{c.emoji}</div>
                <div
                  className="font-semibold text-sm mb-1"
                  style={{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {c.label}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(180deg, #F8F9FC 0%, #EEF2FB 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
                fontWeight: 700,
                color: 'var(--foreground)',
              }}
            >
              Everything Your Church Needs
            </h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              One platform. Every layer of your church ministry, covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b: BenefitCard) => {
              const Icon = b.icon
              return (
                <div
                  key={b.title}
                  className="p-6 rounded-2xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: b.bg }}
                  >
                    <Icon size={20} style={{ color: b.color }} />
                  </div>
                  <h3
                    className="font-semibold mb-2"
                    style={{
                      color: 'var(--foreground)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {b.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
                  fontWeight: 700,
                  color: 'var(--foreground)',
                }}
              >
                Everything Included,
                <br />
                <em style={{ color: 'var(--church-blue)', fontStyle: 'italic' }}>
                  Right Out of the Box
                </em>
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                No feature gating, no add-on modules. Every church gets access to the complete
                platform from day one.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105"
                style={{
                  background: 'var(--church-blue)',
                  boxShadow: '0 4px 16px rgba(27,58,122,0.25)',
                }}
              >
                View Pricing <ArrowRight size={16} />
              </Link>
            </div>
            <div
              className="rounded-2xl p-7"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="space-y-3">
                {included.map((item: string) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} style={{ color: '#059669', flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1A40, #1B3A7A)' }}
      >
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
              fontWeight: 700,
            }}
          >
            Ready to Transform Your Church?
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Join 2,400+ churches using My Church every Sunday. Setup takes less than 48 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/church-onboarding"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'var(--church-gold)',
                boxShadow: '0 4px 20px rgba(200,150,44,0.4)',
              }}
            >
              Start Onboarding <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
              }}
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default ForChurchesPage
