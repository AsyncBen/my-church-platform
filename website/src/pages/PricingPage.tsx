import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { FC, useState } from 'react'
import { Link } from 'react-router'
import { PageLayout, PageHero } from '../components/Layout'

// Types
interface PricingTier {
  name: string
  emoji: string
  price: {
    monthly: number
    annual: number
  }
  description: string
  members: string
  color: string
  bg: string
  border: string
  features: string[]
  cta: string
  highlight: boolean
}

interface FAQ {
  q: string
  a: string
}

// Constants
const plans: PricingTier[] = [
  {
    name: 'Starter',
    emoji: '🌱',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for small churches just getting started with digital ministry.',
    members: 'Up to 100 members',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.2)',
    features: [
      'Congregation mobile app',
      'Scripture synchronization',
      '1 ministry community',
      'Church announcements',
      'Sermon notes',
      'Basic giving (2.9% + $0.30)',
      'Email support',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Growth',
    emoji: '🏛️',
    price: { monthly: 79, annual: 59 },
    description: 'For growing churches that need the full platform and deeper engagement tools.',
    members: 'Up to 500 members',
    color: 'var(--church-blue)',
    bg: 'rgba(27,58,122,0.08)',
    border: 'rgba(27,58,122,0.25)',
    features: [
      'Everything in Starter',
      'Unlimited ministry communities',
      'Media team dashboard',
      'Scripture queue management',
      'Push notification campaigns',
      'Giving at 1.9% + $0.25',
      'Fund reporting & dashboards',
      'Priority support',
      'Church branding & colors',
    ],
    cta: 'Start 30-Day Trial',
    highlight: true,
  },
  {
    name: 'Pro',
    emoji: '🌐',
    price: { monthly: 179, annual: 139 },
    description: 'For larger and multi-campus churches requiring advanced tools and integrations.',
    members: 'Up to 5,000 members',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.2)',
    features: [
      'Everything in Growth',
      'Multi-campus support',
      'Advanced analytics',
      'API access',
      'ChMS integrations',
      'Custom giving at 1.5% + $0.20',
      'White-label option',
      'Dedicated success manager',
      'SLA guarantee',
      'SSO & admin controls',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const faqs: FAQ[] = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — the Growth plan includes a full 30-day free trial with no credit card required. You get access to the complete feature set so you can experience the platform before committing.',
  },
  {
    q: 'How does giving processing work?',
    a: 'My Church processes giving through our secure payment partner. Transaction fees are listed per plan. There are no monthly platform fees charged on giving — only the per-transaction rate.',
  },
  {
    q: 'Can we switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at your next billing cycle.',
  },
  {
    q: 'What does \'member\' count mean?',
    a: 'A member is any individual with an active account connected to your church in My Church. Inactive accounts or app downloads don\'t count toward your limit.',
  },
  {
    q: 'Do you offer discounts for smaller churches?',
    a: 'Yes. We offer compassionate pricing for churches facing financial hardship. Please contact our team to discuss your situation — we want to make My Church accessible to every church.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'None. There are no setup fees, no hidden onboarding costs, and no contract commitments on monthly plans.',
  },
]

// Component
export const PricingPage: FC = () => {
  const [annual, setAnnual] = useState<boolean>(true)

  return (
    <PageLayout>
      <PageHero
        badge="Simple, Honest Pricing"
        title={
          <>
            Plans for Every
            <br />
            <em style={{ color: 'var(--church-gold-light)' }}>Size of Church</em>
          </>
        }
        subtitle="No feature gating, no hidden fees. Every plan includes the core platform. Pay for scale, not access."
      />

      {/* Toggle */}
      <section className="pb-4 pt-12" style={{ background: 'var(--background)' }}>
        <div className="flex items-center justify-center gap-4">
          <span
            className="text-sm font-medium"
            style={{
              color: annual ? 'var(--muted-foreground)' : 'var(--foreground)',
            }}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-12 h-6 rounded-full transition-all"
            style={{ background: annual ? 'var(--church-blue)' : 'var(--muted)' }}
            aria-label="Toggle billing period"
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
              style={{
                left: annual ? 'calc(100% - 1.375rem)' : '0.125rem',
              }}
            />
          </button>
          <span
            className="text-sm font-medium"
            style={{
              color: annual ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}
          >
            Annual
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(200,150,44,0.12)',
                color: 'var(--church-gold)',
              }}
            >
              Save 25%
            </span>
          </span>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 pb-24" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan: PricingTier) => (
              <div
                key={plan.name}
                className="rounded-2xl p-7 relative"
                style={{
                  background: plan.highlight ? 'var(--church-blue)' : 'var(--card)',
                  border: plan.highlight ? 'none' : '1px solid var(--border)',
                  boxShadow: plan.highlight
                    ? '0 24px 60px rgba(27,58,122,0.35)'
                    : undefined,
                  transform: plan.highlight ? 'scale(1.03)' : undefined,
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                    style={{
                      background: 'var(--church-gold)',
                      color: '#fff',
                    }}
                  >
                    <Zap size={11} /> Most Popular
                  </div>
                )}

                <div className="text-3xl mb-3">{plan.emoji}</div>
                <div
                  className="text-lg font-bold mb-1"
                  style={{
                    color: plan.highlight ? '#fff' : 'var(--foreground)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {plan.name}
                </div>
                <div
                  className="text-xs mb-5 leading-relaxed"
                  style={{
                    color: plan.highlight
                      ? 'rgba(255,255,255,0.65)'
                      : 'var(--muted-foreground)',
                  }}
                >
                  {plan.description}
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 42,
                      color: plan.highlight ? '#fff' : 'var(--foreground)',
                    }}
                  >
                    {plan.price.monthly === 0
                      ? 'Free'
                      : `$${annual ? plan.price.annual : plan.price.monthly}`}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span
                      className="text-sm ml-1"
                      style={{
                        color: plan.highlight
                          ? 'rgba(255,255,255,0.5)'
                          : 'var(--muted-foreground)',
                      }}
                    >
                      /mo
                    </span>
                  )}
                </div>
                <div
                  className="text-xs mb-6"
                  style={{
                    color: plan.highlight
                      ? 'rgba(255,255,255,0.5)'
                      : 'var(--muted-foreground)',
                  }}
                >
                  {plan.members}
                  {plan.price.monthly > 0 && annual && ' · billed annually'}
                </div>

                {/* CTA */}
                <Link
                  to={plan.name === 'Pro' ? '/contact' : '/church-onboarding'}
                  className="block w-full text-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all hover:scale-105"
                  style={{
                    background: plan.highlight ? 'var(--church-gold)' : 'var(--church-blue)',
                    color: '#fff',
                    boxShadow: plan.highlight
                      ? '0 4px 16px rgba(200,150,44,0.4)'
                      : '0 4px 16px rgba(27,58,122,0.25)',
                  }}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-2.5">
                  {plan.features.map((f: string) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle
                        size={15}
                        style={{
                          color: plan.highlight
                            ? 'rgba(255,255,255,0.7)'
                            : '#059669',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: plan.highlight
                            ? 'rgba(255,255,255,0.8)'
                            : 'var(--foreground)',
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise note */}
          <div
            className="mt-8 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div>
              <div
                className="font-semibold mb-1"
                style={{
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                🏢 Large Church or Network? Let's talk.
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                For multi-campus networks, denominations, or churches over 5,000 members — we
                offer custom enterprise agreements with dedicated support.
              </p>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105"
              style={{
                background: 'var(--church-blue)',
                whiteSpace: 'nowrap',
              }}
            >
              Contact Sales <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(180deg, #F8F9FC, #EEF2FB)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem,3.5vw,2.4rem)',
              fontWeight: 700,
              color: 'var(--foreground)',
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq: FAQ) => (
              <div
                key={faq.q}
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="font-semibold mb-2"
                  style={{
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {faq.q}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default PricingPage
