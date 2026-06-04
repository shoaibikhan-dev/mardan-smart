import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', phone: '', cnic: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const [agreed,  setAgreed]  = useState(false)
  const [currentImg, setCurrentImg] = useState(0)

  const bgImages = ['/pic-1.png', '/pic-2.png', '/pic-3.png', '/pic-4.png']

  useEffect(() => {
    const timer = setInterval(() => setCurrentImg(p => (p + 1) % bgImages.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e) => {
    setError('')
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim())            return 'Full name is required.'
    if (!form.email.includes('@'))    return 'Please enter a valid email address.'
    if (form.cnic.length < 13)        return 'Please enter a valid CNIC (13 digits).'
    if (!form.phone.trim())           return 'Phone number is required.'
    if (form.password.length < 6)     return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    if (!agreed)                      return 'You must agree to the terms of service.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError('')
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, cnic: form.cnic, password: form.password })
      // Auto-redirected by PublicRoute on auth success
    } catch (err) {
      if (err.message === 'Network Error') {
        setError('Network Error: The backend server is unreachable.');
        return;
      }
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        setError(backendErrors[0].msg);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#241e30] flex">
      {/* ── Left Panel (Image & Branding) ────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 overflow-hidden">
        {bgImages.map((src, i) => (
          <div key={src} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${src}')` }} />
        ))}
        <div className="absolute inset-0 bg-[#241e30]/50 mix-blend-multiply z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241e30]/90 via-transparent to-[#241e30]/30 z-0" />
        
        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="text-xl">🏙️</span>
            </div>
            <span className="text-white font-display font-bold text-2xl tracking-tight">Mardan</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white text-sm font-medium border border-white/10 hover:border-white/20">
            Back to website <span className="text-base leading-none">→</span>
          </Link>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 mb-8">
          <h2 className="text-white font-display text-5xl font-medium leading-[1.15] mb-8 tracking-tight max-w-lg">
            Empowering Citizens,<br />Building the Future
          </h2>
          <div className="flex gap-2">
            <div className="w-8 h-1 rounded-full bg-white/30" />
            <div className="w-8 h-1 rounded-full bg-white/30" />
            <div className="w-12 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-8 relative">
        {/* Mobile back button */}
        <Link to="/" className="lg:hidden absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2 z-10">
          <span>✕</span> Close
        </Link>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-white font-display font-medium text-3xl mb-1 tracking-tight">Create an account</h1>
          <p className="text-white/50 text-sm mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 hover:underline transition-colors underline-offset-4">
              Log in
            </Link>
          </p>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 mb-4 animate-fade-in">
              <span className="text-red-400 flex-shrink-0">⚠️</span>
              <p className="text-red-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            
            {/* Row 1: Name and CNIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50"
                />
              </div>
              <div>
                <input
                  name="cnic"
                  type="text"
                  required
                  placeholder="CNIC (13 digits)"
                  value={form.cnic}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* Row 2: Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50"
                />
              </div>
              <div>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* Row 3: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              
              <div className="relative">
                <input
                  name="confirm"
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition disabled:opacity-50 pr-10"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer group mt-4">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-all border ${
                    agreed 
                      ? 'bg-brand-500 border-brand-500' 
                      : 'bg-white/5 border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {agreed && <span className="text-white text-[10px]">✓</span>}
                </div>
              </div>
              <p className="text-white/70 text-xs leading-tight">
                I agree to the <a href="#" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">Terms & Conditions</a>
              </p>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 hover:bg-brand-400 bg-brand-500"
              style={{
                boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
