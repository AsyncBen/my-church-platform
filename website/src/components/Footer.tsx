import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FC } from 'react'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

interface Social {
  label: string
  icon: string
  href: string
}

const CHURCH_GOLD = '#C8962C'
const BACKGROUND = '#080F24'
const BORDER_COLOR = 'rgba(255,255,255,0.06)'

const navGroups: NavGroup[] = [
  {
    label: 'Platform',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Live Service', href: '/#live-service' },
      { label: 'Ministry Communities', href: '/#ministries' },
      { label: 'Media Dashboard', href: '/media-team-setup' },
      { label: 'For Churches', href: '/for-churches' },
    ],
  },
  {
    label: 'For Churches',
    links: [
      { label: 'Getting Started', href: '/church-onboarding' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Church Onboarding', href: '/church-onboarding' },
      { label: 'Media Team Setup', href: '/media-team-setup' },
      { label: 'Training & Support', href: '/training-support' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'Training Videos', href: '/training-support' },
      { label: 'Onboarding Guide', href: '/church-onboarding' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/our-mission' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
]

const socials: Social[] = [
  { label: 'Twitter', icon: '𝕏', href: '#' },
  { label: 'Instagram', icon: '📸', href: '#' },
  { label: 'Facebook', icon: '𝒇', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
]

export const Footer: FC = () => {
  const currentYear: number = new Date().getFullYear()

  return (
    <footer
      style={{ background: BACKGROUND, borderTop: `1px solid ${BORDER_COLOR}` }}
    >
      {/* CTA strip */}
      <div
        className="border-b"
        style={{ borderColor: BORDER_COLOR }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-white mb-1"
              style={{ fontWeight: 700, fontSize: 22 }}
            >
              Ready to Connect Your Church?
            </h3>
            <p className="text-white/50 text-sm">
              Join 2,400+ churches already using My Church every Sunday.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              to="/church-onboarding"
              className="px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105"
              style={{ background: CHURCH_GOLD, boxShadow: '0 4px 16px rgba(200,150,44,0.35)' }}
            >
              Get Started Free
            </Link>
            <Link
              to="/for-churches"
              className="px-6 py-3 rounded-full font-medium text-white/70 hover:text-white text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: CHURCH_GOLD }}
              >
                <span style={{ fontSize: 16 }}>✝</span>
              </div>
              <span
                className="text-white"
                style={{ fontWeight: 700, fontSize: 18 }}
              >
                My Church
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              The connected digital church ecosystem designed to bring congregations together.
            </p>
            <div className="flex gap-3">
              {socials.map((social: Social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 14,
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map((group: NavGroup) => (
            <div key={group.label}>
              <div
                className="text-white/80 font-semibold text-xs tracking-widest uppercase mb-4"
              >
                {group.label}
              </div>
              <ul className="space-y-2.5">
                {group.links.map((link: NavLink) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/40 hover:text-white/80 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${BORDER_COLOR}` }}
        >
          <div className="text-white/30 text-xs">
            © {currentYear} My Church Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            Made with <Heart size={10} fill={CHURCH_GOLD} style={{ color: CHURCH_GOLD }} /> for the Church
          </div>
          <div className="flex gap-5 text-xs text-white/30">
            <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white/60 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
