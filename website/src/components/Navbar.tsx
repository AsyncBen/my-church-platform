import { useState, useEffect, FC } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'For Churches', href: '/for-churches' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/training-support' },
]

const CHURCH_GOLD = '#C8962C'

export const Navbar: FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const alwaysDark: boolean = !isHome || scrolled

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: alwaysDark ? 'rgba(15, 28, 63, 0.96)' : 'transparent',
        backdropFilter: alwaysDark ? 'blur(12px)' : 'none',
        borderBottom: alwaysDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: CHURCH_GOLD }}
          >
            <span style={{ fontSize: 16 }}>✝</span>
          </div>
          <span
            className="text-white tracking-tight font-bold"
            style={{ fontSize: 20 }}
          >
            My Church
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link: NavLink) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-white/75 hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/contact"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/church-onboarding"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: CHURCH_GOLD,
              color: '#fff',
              boxShadow: `0 2px 12px rgba(200,150,44,0.4)`,
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: 'rgba(15, 28, 63, 0.98)' }}
        >
          {navLinks.map((link: NavLink) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-white/80 hover:text-white text-base font-medium py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/church-onboarding"
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-center"
            style={{ background: CHURCH_GOLD, color: '#fff' }}
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}
