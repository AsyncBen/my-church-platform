import { ReactNode, FC } from 'react'

interface PageHeroProps {
  badge?: string
  badgeColor?: string
  title: ReactNode
  subtitle?: string
  dark?: boolean
}

const CHURCH_GOLD = '#C8962C'
const DARK_BACKGROUND = 'linear-gradient(135deg, #0B1A40 0%, #1B3A7A 60%, #0F2455 100%)'

export const PageHero: FC<PageHeroProps> = ({
  badge,
  badgeColor = CHURCH_GOLD,
  title,
  subtitle,
  dark = true,
}: PageHeroProps) => {
  if (dark) {
    return (
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background: DARK_BACKGROUND,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 80%, rgba(200,150,44,0.1) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {badge && (
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
              style={{
                background: 'rgba(200,150,44,0.15)',
                border: '1px solid rgba(200,150,44,0.3)',
                color: badgeColor,
              }}
            >
              {badge}
            </div>
          )}
          <h1
            className="text-white mb-5"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--background))' }}
        />
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: 'rgba(27,58,122,0.08)',
              border: '1px solid rgba(27,58,122,0.15)',
              color: 'var(--church-blue)',
            }}
          >
            {badge}
          </div>
        )}
        <h1
          className="mb-5"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'var(--foreground)',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero
