import { useInView } from 'react-intersection-observer'

const emergencies = [
  {
    icon:       '🚑',
    title:      'Rescue 1122',
    number:     '1122',
    desc:       'Medical emergencies, fire rescue, road accidents & disaster relief.',
    available:  '24/7 Active',
    color:      'from-red-500 to-rose-600',
    bgGlow:     'rgba(239,68,68,0.2)',
    pulse:      true,
    tag:        'Emergency',
  },
  {
    icon:       '🚓',
    title:      'Police Emergency',
    number:     '15',
    desc:       'Crime reporting, public safety threats, and law enforcement assistance.',
    available:  '24/7 Active',
    color:      'from-blue-600 to-blue-800',
    bgGlow:     'rgba(37,99,235,0.2)',
    pulse:      true,
    tag:        'Security',
  },
  {
    icon:       '🔥',
    title:      'Fire Brigade',
    number:     '16',
    desc:       'Building fires, industrial accidents, and hazardous material incidents.',
    available:  '24/7 Active',
    color:      'from-orange-500 to-red-600',
    bgGlow:     'rgba(249,115,22,0.2)',
    pulse:      true,
    tag:        'Fire',
  },
  {
    icon:       '🏥',
    title:      'DHQ Hospital',
    number:     '091-9230451',
    desc:       "District Headquarters Hospital \u2014 Mardan's main public health facility.",
    available:  'Emergency Wing Open',
    color:      'from-teal-500 to-cyan-600',
    bgGlow:     'rgba(20,184,166,0.2)',
    pulse:      false,
    tag:        'Medical',
  },
  {
    icon:       '💧',
    title:      'Water Emergency',
    number:     '1230',
    desc:       'Burst pipes, flooding, water supply cut-offs, and sewage overflow.',
    available:  'Mon–Sat 8am–10pm',
    color:      'from-cyan-500 to-sky-700',
    bgGlow:     'rgba(14,165,233,0.2)',
    pulse:      false,
    tag:        'Utilities',
  },
  {
    icon:       '⚡',
    title:      'PESCO Helpline',
    number:     '118',
    desc:       'Electricity outages, dangerous wiring, and transformer faults.',
    available:  '24/7 Active',
    color:      'from-yellow-400 to-amber-500',
    bgGlow:     'rgba(245,158,11,0.2)',
    pulse:      true,
    tag:        'Power',
  },
]

function EmergencyCard({ em, index }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div
      ref={ref}
      className="group relative glass-card overflow-hidden transition-all duration-400 hover:shadow-card-hover cursor-pointer"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
      }}
    >
      {/* Hover glow background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at center, ${em.bgGlow}, transparent 70%)` }}
      />

      <div className="relative p-6">
        {/* Top: Icon + Tag */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${em.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {em.icon}
          </div>
          <div className="flex items-center gap-2">
            {em.pulse && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-medium">
              {em.tag}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-brand-300 transition-colors">
          {em.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-5">{em.desc}</p>

        {/* Call Button */}
        <a
          href={`tel:${em.number}`}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r ${em.color} hover:opacity-90 transition-all duration-200 hover:shadow-lg group-hover:scale-[1.02]`}
        >
          <div className="flex items-center gap-3">
            <span className="text-white text-lg">📞</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">{em.number}</p>
              <p className="text-white/70 text-xs mt-0.5">{em.available}</p>
            </div>
          </div>
          <span className="text-white/80 text-sm font-medium">Call →</span>
        </a>
      </div>
    </div>
  )
}

export default function Emergency() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="emergency" className="py-12 relative overflow-hidden scroll-mt-20">
      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            Emergency Services — Always Active
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5">
            Emergency{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
              Hotlines
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            One-tap access to all critical emergency services in Mardan. Save these numbers — they could save a life.
          </p>
        </div>

        {/* Emergency Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {emergencies.map((em, i) => (
            <EmergencyCard key={em.title} em={em} index={i} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className={`mt-10 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/30 text-sm">
            ⚠️ For life-threatening emergencies, call <strong className="text-red-400">1122</strong> or <strong className="text-blue-400">15</strong> immediately. Do not use the complaint portal for emergencies.
          </p>
        </div>
      </div>
    </section>
  )
}
