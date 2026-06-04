import { useInView } from 'react-intersection-observer'

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Routing',
    desc: 'Smart categorization automatically routes your complaint to the right department.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: '📱',
    title: 'Mobile-First Design',
    desc: 'Access the portal from any device — optimized for phones, tablets, and desktops.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: '🔔',
    title: 'Real-Time Alerts',
    desc: 'Get SMS and email notifications at every stage of your complaint resolution.',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    icon: '🗺️',
    title: 'Location Mapping',
    desc: 'Pin-point the exact location of issues on an interactive Mardan city map.',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: '📊',
    title: 'Open Data Dashboard',
    desc: 'Transparent public dashboard showing city-wide complaint data and trends.',
    color: 'from-green-500 to-emerald-700',
  },
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    desc: 'All data encrypted at rest and in transit. Your identity is fully protected.',
    color: 'from-gold-500 to-gold-600',
  },
]

const timeline = [
  { year: '2022', title: 'Initiative Launched', desc: 'Mardan Smart City project approved by KP Government.' },
  { year: '2023', title: 'Digital Infrastructure', desc: 'City-wide fibre network and IoT sensor deployment begins.' },
  { year: '2024', title: 'Citizen Portal Live', desc: 'Complaint management portal launched for 500,000+ citizens.' },
  { year: '2025', title: 'AI Integration', desc: 'Machine learning-powered complaint routing and prediction.' },
]

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="about" className="py-8 relative overflow-hidden scroll-mt-20">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Features Grid */}
        <div
          ref={ref}
          className={`text-center mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="section-badge mb-5">✨ Platform Features</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5">
            Built for{' '}
            <span className="gradient-text">Smart Governance</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Enterprise-grade technology making city services accessible, transparent, and accountable to every citizen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 hover:shadow-card-hover transition-all duration-400 group"
              style={{
                opacity:    inView ? 1 : 0,
                transform:  inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${i * 70}ms, transform 0.5s ease ${i * 70}ms`,
              }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <span className="section-badge mb-4">🗓️ Our Journey</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              Mardan Smart City{' '}
              <span className="gradient-text">Timeline</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-emerald-500/40 to-transparent" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={item.year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block glass-card p-5 max-w-xs ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                      <p className="gradient-text font-bold text-sm mb-1">{item.year}</p>
                      <p className="text-white font-semibold mb-1">{item.title}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full bg-brand-gradient border-2 border-surface-900 shadow-brand" />

                  {/* Spacer */}
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
