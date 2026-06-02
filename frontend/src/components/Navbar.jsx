import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home',        href: '#home' },
  { label: 'Statistics',  href: '#statistics' },
  { label: 'Services',    href: '#services' },
  { label: 'Emergency',   href: '#emergency' },
  { label: 'Complaints',  href: '#complaints' },
  { label: 'About',       href: '#about' },
]
export default function Navbar({ darkMode, setDarkMode }) {
  const { isAuthenticated, user, logout } = useAuth()
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // ScrollSpy Logic
      let currentSection = '#home';
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is near the top of the viewport (with some offset for the navbar)
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = link.href;
            break;
          }
        }
      }
      setActiveLink(currentSection);
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/8 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ──────────────────────────────────────────── */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-surface-900 animate-pulse-slow" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-lg leading-tight">Mardan</p>
              <p className="gradient-text text-xs font-semibold tracking-widest uppercase">Smart City</p>
            </div>
          </a>

          {/* ── Desktop Nav ─────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  activeLink === link.href
                    ? 'text-brand-400'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {activeLink === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-400 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* ── Right Actions ───────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">


            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-white/10">
                <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white hidden xl:block group-hover:text-brand-300 transition-colors">
                    {user.name}
                  </span>
                </Link>
                <button onClick={logout} className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-5 py-2.5">
                Sign In →
              </Link>
            )}
          </div>

          {/* ── Mobile Hamburger ────────────────────────────── */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────── */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-surface-900/98 backdrop-blur-xl border-t border-white/8 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <a href="#complaints" className="btn-outline text-sm text-center">🗒️ File Complaint</a>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-outline text-sm text-center">👤 Dashboard</Link>
                <button onClick={logout} className="text-sm text-red-400 py-2 hover:text-red-300 transition">Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm text-center justify-center">Sign In →</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
