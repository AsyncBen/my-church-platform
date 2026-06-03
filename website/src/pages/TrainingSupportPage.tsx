import { BookOpen, Video, MessageSquare, Phone, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router'
import { PageLayout, PageHero } from '../components/Layout'

// Types
interface SupportChannel {
  icon: React.ElementType
  title: string
  desc: string
  availability: string
  color: string
  bg: string
  cta: string
}

interface TrainingModule {
  module: string
  title: string
  duration: string
  desc: string
  level: string
  levelColor: string
}

interface FAQ {
  q: string
  a: string
}

// Constants
const supportChannels: SupportChannel[] = [
  {
    icon: MessageSquare,
    title: 'Live Chat Support',
    desc: 'Chat with a real support specialist in real time during business hours.',
    availability: 'Mon–Fri, 9am–6pm EST',
    color: 'var(--church-blue)',
    bg: 'rgba(27,58,122,0.08)',
    cta: 'Open Chat',
  },
  {
    icon: Phone,
    title: 'Phone & Video Support',
    desc: 'For complex issues or hands-on training, book a call with our team.',
    availability: 'By appointment · Growth & Pro plans',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    cta: 'Book a Call',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    desc: 'Comprehensive written guides for every feature and workflow.',
    availability: 'Always available',
    color: 'var(--church-gold)',
    bg: 'rgba(200,150,44,0.08)',
    cta: 'Read the Docs',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    desc: 'Screen-recorded tutorials for every part of the platform, from setup to daily use.',
    availability: 'Always available',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    cta: 'Watch Tutorials',
  },
]

const trainingModules: TrainingModule[] = [
  {
    module: '01',
    title: 'Platform Overview',
    duration: '12 min',
    desc: 'A high-level walkthrough of the My Church ecosystem — from the congregation app to the media dashboard.',
    level: 'Beginner',
    levelColor: '#059669',
  },
  {
    module: '02',
    title: 'Admin Dashboard Basics',
    duration: '18 min',
    desc: 'Learn to navigate the admin dashboard, manage members, and configure church settings.',
    level: 'Beginner',
    levelColor: '#059669',
  },
  {
    module: '03',
    title: 'Ministry Community Setup',
    duration: '22 min',
    desc: 'Create and manage ministry channels, assign leaders, and configure access levels.',
    level: 'Intermediate',
    levelColor: 'var(--church-blue)',
  },
  {
    module: '04',
    title: 'Media Dashboard Mastery',
    duration: '35 min',
    desc: 'Everything your media team needs — scripture queues, live broadcasting, and real-time monitoring.',
    level: 'Intermediate',
    levelColor: 'var(--church-blue)',
  },
  {
    module: '05',
    title: 'Giving Configuration',
    duration: '20 min',
    desc: 'Set up funds, configure giving flows, and access financial reports and tax receipt generation.',
    level: 'Intermediate',
    levelColor: 'var(--church-blue)',
  },
  {
    module: '06',
    title: 'Advanced Church Administration',
    duration: '40 min',
    desc: 'Multi-admin setup, permission management, ChMS integrations, and API configuration for Pro plans.',
    level: 'Advanced',
    levelColor: '#7C3AED',
  },
]

const faqs: FAQ[] = [
  {
    q: 'What are your support hours?',
    a: 'Live chat and phone support are available Monday–Friday, 9am–6pm Eastern. Email support and documentation are always available.',
  },
  {
    q: 'Is training included in my plan?',
    a: 'Yes — all plans include access to our full documentation and video training library. Growth and Pro plans also include onboarding call credits.',
  },
  {
    q: 'How quickly do you respond to support requests?',
    a: 'Starter plan: within 24 hours. Growth plan: within 4 business hours. Pro plan: within 1 business hour with SLA guarantees.',
  },
  {
    q: 'Can you train our entire staff?',
    a: 'Absolutely. Pro plans include group training sessions. Contact our team to schedule a training session for your leadership and media team.',
  },
]

// Component
export const TrainingSupportPage: FC = () => {
  return (
    <PageLayout>
      <PageHero
        badge="Training & Support"
        title={
          <>
            We're With You
            <br />
            <em style={{ color: 'var(--church-gold-light)' }}>Every Step of the Way</em>
          </>
        }
        subtitle="From your first login to your thousandth Sunday service — our team and training resources are always here for you."
      />

      {/* Support channels */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2
            className="text-center mb-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem,3vw,2.2rem)',
              fontWeight: 700,
              color: 'var(--foreground)',
            }}
          >
            Support Channels
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {supportChannels.map((c: SupportChannel) => {
              const Icon = c.icon
              return (
                <div
                  key={c.title}
                  className="p-6 rounded-2xl flex gap-5 transition-all hover:shadow-md"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg }}
                  >
                    <Icon size={22} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div
                      className="font-semibold mb-1"
                      style={{
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {c.title}
                    </div>
                    <p
                      className="text-sm mb-2 leading-relaxed"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {c.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock size={12} style={{ color: 'var(--muted-foreground)' }} />
                      <span
                        className="text-xs"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {c.availability}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Training modules */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(180deg, #EEF2FB, #F8F9FC)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                fontWeight: 700,
                color: 'var(--foreground)',
              }}
            >
              Training Curriculum
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Self-paced video modules for every role on your team.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {trainingModules.map((m: TrainingModule) => (
              <div
                key={m.module}
                className="p-5 rounded-2xl flex gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: 'rgba(27,58,122,0.08)',
                    color: 'var(--church-blue)',
                  }}
                >
                  {m.module}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className="font-semibold text-sm"
                      style={{
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {m.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: `${m.levelColor}15`,
                          color: m.levelColor,
                        }}
                      >
                        {m.level}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {m.duration}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2
            className="text-center mb-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem,3vw,2.2rem)',
              fontWeight: 700,
              color: 'var(--foreground)',
            }}
          >
            Support FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((f: FAQ) => (
              <div
                key={f.q}
                className="rounded-2xl p-5"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="font-semibold mb-2 text-sm"
                  style={{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {f.q}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #0B1A40, #1B3A7A)' }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem,3.5vw,2.4rem)',
              fontWeight: 700,
            }}
          >
            Still Have Questions?
          </h2>
          <p className="text-white/60 mb-8">
            Our team is ready to help. Reach out and we'll get back to you within the hour.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{
              background: 'var(--church-gold)',
              boxShadow: '0 4px 20px rgba(200,150,44,0.4)',
            }}
          >
            Contact Support <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}

export default TrainingSupportPage
