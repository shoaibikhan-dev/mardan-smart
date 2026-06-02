import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

// ── Custom count-up hook (no external dependency, highly performant) ──────────
function useCountUp(end, duration = 2000, started = false) {
  const nodeRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!nodeRef.current) return
    if (!started) { 
      nodeRef.current.textContent = '0'
      return 
    }
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) // easeOutExpo
      const currentCount = Math.floor(ease * end)
      nodeRef.current.textContent = currentCount.toLocaleString()
      
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
      else nodeRef.current.textContent = end.toLocaleString()
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started, end, duration])

  return nodeRef
}

// ── Stats data ───────────────────────────────────────────────────────────────
const stats = [
  { icon: '📋', value: 1248,  suffix: '+', label: 'Total Complaints',    sub: 'Received in 2024',        color: 'from-brand-500 to-brand-700'   },
  { icon: '✅', value: 986,   suffix: '',  label: 'Complaints Resolved', sub: 'Successfully closed',      color: 'from-gold-400 to-gold-600'},
  { icon: '⚡', value: 48,    suffix: 'h', label: 'Avg. Response Time',  sub: 'Hours to first action',    color: 'from-gold-500 to-gold-600'     },
  { icon: '🏢', value: 12,    suffix: '',  label: 'City Departments',    sub: 'Working together',         color: 'from-purple-500 to-purple-700' },
  { icon: '👥', value: 24800, suffix: '+', label: 'Registered Citizens', sub: 'Active users on platform', color: 'from-pink-500 to-rose-600'     },
  { icon: '📈', value: 94,    suffix: '%', label: 'Satisfaction Rate',   sub: 'Citizen happiness score',  color: 'from-cyan-500 to-sky-600'      },
]

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3, triggerOnce: true })
  const countRef = useCountUp(stat.value, 2000, inView)

  return (
    <div
      ref={inViewRef}
      className="stat-card glass-card p-7 transition-all duration-500 cursor-default"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, box-shadow 0.3s ease`,
      }}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
        {stat.icon}
      </div>
      <div className="flex items-end gap-0.5 mb-1">
        <span ref={countRef} className="text-4xl font-black text-white leading-none font-display">
          0
        </span>
        <span className="text-2xl font-bold text-white/80 mb-0.5">{stat.suffix}</span>
      </div>
      <p className="text-white font-bold text-base mb-1 tracking-wide">{stat.label}</p>
      <p className="text-white/50 text-sm tracking-wide">{stat.sub}</p>
      <div className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${stat.color} opacity-60`} />
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Statistics() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="statistics" className="py-12 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="section-badge mb-5 shadow-brand">📊 Live City Data</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5">
            Mardan by the{' '}
            <span className="gradient-text text-shadow-glow">Numbers</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-[1.7] tracking-wide">
            Real-time performance metrics reflecting our commitment to transparent, accountable governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <div className={`mt-12 glass-card neon-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gold-400 rounded-full animate-ping-slow shadow-[0_0_8px_#fbbf24]" />
            <p className="text-white/80 text-sm tracking-wide">
              Data updated <span className="text-gold-400 font-bold">live</span> — Last sync: {new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}
            </p>
          </div>
          <a href="#" className="text-brand-400 text-sm font-semibold hover:text-brand-300 transition flex items-center gap-1">
            View Full Dashboard →
          </a>
        </div>
      </div>
    </section>
  )
}
