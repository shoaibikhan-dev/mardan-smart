import { useInView } from 'react-intersection-observer'

const services = [
  {
    icon:  '🗺️',
    title: 'Roads & Infrastructure',
    desc:  'Report potholes, damaged roads, broken bridges, and street lighting issues.',
    count: '312 resolved',
    color: 'from-brand-500 to-brand-700',
    tag:   'Infrastructure',
  },
  {
    icon:  '💧',
    title: 'Water Supply',
    desc:  'Report water shortages, pipe bursts, contamination, and billing disputes.',
    count: '208 resolved',
    color: 'from-brand-400 to-brand-600',
    tag:   'Utilities',
  },
  {
    icon:  '⚡',
    title: 'Electricity',
    desc:  'Report power outages, faulty meters, dangerous wiring, and supply issues.',
    count: '195 resolved',
    color: 'from-gold-400 to-gold-600',
    tag:   'Utilities',
  },
  {
    icon:  '🗑️',
    title: 'Sanitation & Waste',
    desc:  'Report garbage collection failures, illegal dumping, and drainage blockages.',
    count: '167 resolved',
    color: 'from-gold-500 to-gold-700',
    tag:   'Sanitation',
  },
  {
    icon:  '🌳',
    title: 'Parks & Recreation',
    desc:  'Report damaged park equipment, overgrown trees, and unsafe public spaces.',
    count: '89 resolved',
    color: 'from-brand-600 to-brand-800',
    tag:   'Environment',
  },
  {
    icon:  '🚔',
    title: 'Public Safety',
    desc:  'Report unsafe structures, street crime hotspots, and public hazards.',
    count: '143 resolved',
    color: 'from-rose-500 to-rose-700',
    tag:   'Safety',
  },
  {
    icon:  '🔊',
    title: 'Noise Pollution',
    desc:  'Report construction noise, loudspeaker violations, and industrial noise.',
    count: '56 resolved',
    color: 'from-fuchsia-500 to-purple-700',
    tag:   'Environment',
  },
  {
    icon:  '🏗️',
    title: 'Illegal Construction',
    desc:  'Report unauthorized buildings, encroachments, and zoning violations.',
    count: '72 resolved',
    color: 'from-orange-400 to-orange-600',
    tag:   'Planning',
  },
]

function ServiceCard({ svc, index }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div
      ref={ref}
      className="group glass-card p-6 hover:shadow-card-hover transition-all duration-400 cursor-pointer"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {svc.icon}
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
          {svc.tag}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-white font-bold text-base mb-2 group-hover:text-brand-300 transition-colors">
        {svc.title}
      </h3>
      <p className="text-white/60 text-sm leading-[1.6] tracking-wide mb-4">{svc.desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/8">
        <span className="text-gold-400 text-xs font-medium flex items-center gap-1">
          <span>✓</span> {svc.count}
        </span>
        <a
          href="#complaints"
          className="text-brand-400 text-xs font-semibold flex items-center gap-1 hover:text-brand-300 transition group-hover:gap-2"
        >
          Report <span>→</span>
        </a>
      </div>
    </div>
  )
}

export default function Services() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="services" className="py-8 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="section-badge mb-5 shadow-brand">🛠️ City Services</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5">
            What Can You{' '}
            <span className="gradient-text text-shadow-glow">Report?</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-[1.7] tracking-wide">
            Choose your complaint category and our dedicated teams will respond within 48 hours.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} index={i} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className={`mt-8 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-card neon-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Don't see your issue?</h3>
              <p className="text-white/50 text-sm">Use our "Other" category and describe your concern in detail.</p>
            </div>
            <a href="#complaints" className="btn-primary whitespace-nowrap">
              📝 File Custom Complaint
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
