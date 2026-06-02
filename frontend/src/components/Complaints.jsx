import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link, useNavigate } from 'react-router-dom'
import { complaintService } from '../services/complaintService'
import { useAuth } from '../context/AuthContext'

const steps = [
  { step: '01', icon: '📝', title: 'Submit',  desc: 'Fill in your complaint details, location, and attach photos.' },
  { step: '02', icon: '🎫', title: 'Track ID', desc: 'Receive a unique MSC-XXXXXX tracking code instantly.' },
  { step: '03', icon: '🔄', title: 'Review',  desc: 'Our team reviews and assigns to the right department.' },
  { step: '04', icon: '✅', title: 'Resolved', desc: 'Get notified when your complaint is resolved.' },
]

const categories = [
  'Roads & Infrastructure', 'Water Supply', 'Electricity',
  'Sanitation & Waste', 'Parks & Recreation', 'Public Safety',
  'Noise Pollution', 'Illegal Construction', 'Other',
]

export default function Complaints() {
  const [tab,            setTab]         = useState('submit')   // 'submit' | 'track'
  const [trackId,        setTrackId]     = useState('')
  const [trackResult,    setTrackResult] = useState(null)
  const [submitted,      setSubmitted]   = useState(false)
  const [trackingCode,   setTrackingCode] = useState('')
  const [form,           setForm]        = useState({
    name: '', email: '', phone: '', category: '', title: '', description: '', location: '', priority: 'medium',
  })

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSubmitError('')
    try {
      const fd = new FormData()
      Object.keys(form).forEach(k => fd.append(k, form[k]))
      
      const res = await complaintService.createComplaint(fd)
      setTrackingCode(res.data.data.trackingId)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit complaint. Please try again.')
    }
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackId) return
    try {
      const res = await complaintService.trackComplaint(trackId)
      const data = res.data.data
      setTrackResult({
        id:       data.trackingId,
        title:    data.title,
        status:   data.status,
        category: data.category,
        date:     new Date(data.createdAt).toISOString().split('T')[0],
        updates:  [
          { date: new Date(data.createdAt).toISOString().split('T')[0], msg: 'Complaint received and registered.' },
          ...(data.status === 'in_progress' ? [{ date: new Date(data.updatedAt).toISOString().split('T')[0], msg: 'Complaint is being reviewed and processed.' }] : []),
          ...(data.status === 'resolved' ? [{ date: new Date(data.updatedAt).toISOString().split('T')[0], msg: 'Complaint has been successfully resolved.' }] : []),
        ],
      })
    } catch (err) {
      setTrackResult('not_found')
    }
  }

  const statusColor = (s) => ({
    pending:     'text-yellow-400  bg-yellow-400/10  border-yellow-400/30',
    in_progress: 'text-brand-400   bg-brand-400/10   border-brand-400/30',
    resolved:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    rejected:    'text-red-400     bg-red-400/10     border-red-400/30',
  }[s] ?? '')

  const statusLabel = (s) => ({ pending: '⏳ Pending', in_progress: '🔄 In Progress', resolved: '✅ Resolved', rejected: '❌ Rejected' }[s] ?? s)

  return (
    <section id="complaints" className="py-12 bg-surface-800 relative overflow-hidden scroll-mt-20">
      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-brand-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="section-badge mb-5">🗒️ Complaint Portal</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-5">
            Your Voice,{' '}
            <span className="gradient-text">Our Priority</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Submit a new complaint or track an existing one using your unique tracking code.
          </p>
        </div>

        {/* How It Works */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {steps.map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center p-5 glass-card">
              <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm mb-3">
                {s.step}
              </div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
              <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-white/20">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Tab Panel */}
        <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-card neon-border overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/8">
              {[
                { key: 'submit', label: '📝 Submit Complaint' },
                { key: 'track',  label: '🔍 Track Complaint' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                    tab === t.key
                      ? 'text-brand-400 border-b-2 border-brand-400 bg-brand-500/5'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* ── Submit Tab ──────────────────────────────── */}
              {tab === 'submit' && !submitted && (
                !isAuthenticated ? (
                  <div className="py-12 flex flex-col items-center text-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-brand-500/20 border-2 border-brand-500/50 flex items-center justify-center text-4xl">
                      🔒
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-2xl mb-2">Authentication Required</h3>
                      <p className="text-white/60">You need to be logged in to file a civic complaint. This ensures authenticity and allows us to update you on the progress.</p>
                    </div>
                    <Link to="/login" className="btn-primary px-8 py-3.5 mt-2">
                      Sign In to Continue →
                    </Link>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {submitError && <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">{submitError}</div>}
                  {/* Personal Info */}
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Category *</label>
                    <select
                      required
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/60 transition appearance-none"
                    >
                      <option value="">-- Select category --</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-white/60 text-sm font-medium">Complaint Title *</label>
                    <input
                      required
                      type="text"
                      placeholder="Brief one-line description of the issue"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-white/60 text-sm font-medium">Detailed Description *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the problem in detail — when did it start, how severe is it, what impact does it have?"
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Location / Area</label>
                    <input
                      type="text"
                      placeholder="Street, area, or landmark"
                      value={form.location}
                      onChange={e => setForm({...form, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/60 text-sm font-medium">Priority Level</label>
                    <div className="flex gap-3">
                      {['low','medium','high','urgent'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({...form, priority: p})}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize border transition ${
                            form.priority === p
                              ? p === 'urgent' ? 'bg-red-500/20 border-red-500/60 text-red-400'
                              : p === 'high'   ? 'bg-orange-500/20 border-orange-500/60 text-orange-400'
                              : p === 'medium' ? 'bg-brand-500/20 border-brand-500/60 text-brand-400'
                              :                  'bg-green-500/20 border-green-500/60 text-green-400'
                              : 'border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 flex items-center justify-between pt-2">
                    <p className="text-white/30 text-xs">* Required fields. Your data is kept strictly confidential.</p>
                    <button type="submit" className="btn-primary px-10 py-3.5">
                      Submit Complaint →
                    </button>
                  </div>
                </form>
                )
              )}

              {/* ── Success State ───────────────────────────── */}
              {tab === 'submit' && submitted && (
                <div className="py-12 flex flex-col items-center text-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-4xl animate-float">
                    ✅
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">Complaint Submitted!</h3>
                    <p className="text-white/60">Your tracking ID is:</p>
                    <div className="mt-3 px-8 py-3 rounded-2xl bg-brand-500/15 border border-brand-500/40 inline-block">
                      <p className="text-brand-300 font-mono text-2xl font-bold tracking-widest">{trackingCode}</p>
                    </div>
                    <p className="text-white/40 text-sm mt-3">Save this ID — use it to track your complaint status anytime.</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => { setSubmitted(false); setTab('track'); setTrackId(trackingCode) }} className="btn-outline px-6 py-2.5 text-sm">
                      🔍 Track Now
                    </button>
                    <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',category:'',title:'',description:'',location:'',priority:'medium' }) }} className="btn-primary px-6 py-2.5 text-sm">
                      + New Complaint
                    </button>
                  </div>
                </div>
              )}

              {/* ── Track Tab ───────────────────────────────── */}
              {tab === 'track' && (
                <div>
                  <form onSubmit={handleTrack} className="flex gap-3 mb-8">
                    <input
                      type="text"
                      placeholder="Enter your tracking ID (e.g. MSC-7X2K9P)"
                      value={trackId}
                      onChange={e => { setTrackId(e.target.value); setTrackResult(null) }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 transition font-mono"
                    />
                    <button type="submit" className="btn-primary px-7 py-3.5 whitespace-nowrap">
                      Track →
                    </button>
                  </form>

                  {/* Result */}
                  {trackResult === 'not_found' && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-white font-semibold text-lg mb-1">No complaint found</p>
                      <p className="text-white/40 text-sm">Please check your tracking ID and try again.</p>
                    </div>
                  )}

                  {trackResult && trackResult !== 'not_found' && (
                    <div className="space-y-5">
                      {/* Info Bar */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Tracking ID',  value: trackResult.id },
                          { label: 'Category',     value: trackResult.category },
                          { label: 'Filed On',     value: trackResult.date },
                          { label: 'Status',       value: statusLabel(trackResult.status), highlight: true, cls: statusColor(trackResult.status) },
                        ].map(item => (
                          <div key={item.label} className="bg-white/5 rounded-xl p-3.5">
                            <p className="text-white/40 text-xs mb-1">{item.label}</p>
                            <p className={`font-semibold text-sm ${item.highlight ? item.cls.split(' ')[0] : 'text-white'}`}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Title */}
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white/40 text-xs mb-1">Complaint</p>
                        <p className="text-white font-medium">{trackResult.title}</p>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p className="text-white/50 text-sm font-semibold mb-3 uppercase tracking-wide">Activity Timeline</p>
                        <div className="space-y-3">
                          {trackResult.updates.map((u, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full mt-0.5 ${i === trackResult.updates.length - 1 ? 'bg-brand-400' : 'bg-white/20'}`} />
                                {i < trackResult.updates.length - 1 && <div className="w-px h-full bg-white/10 my-1" />}
                              </div>
                              <div className="pb-4">
                                <p className="text-white/40 text-xs">{u.date}</p>
                                <p className="text-white/80 text-sm">{u.msg}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!trackResult && (
                    <p className="text-center text-white/30 text-sm py-6">
                      💡 Tip: Your tracking ID was sent to your email upon complaint submission.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
