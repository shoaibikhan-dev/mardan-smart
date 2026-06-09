import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
// Pages — lazy loaded
const LoginPage    = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
// Homepage sections
import Navbar     from './components/Navbar'
import Hero       from './components/Hero'
import Statistics from './components/Statistics'
import Services   from './components/Services'
import Emergency  from './components/Emergency'
import Complaints from './components/Complaints'
import About      from './components/About'
import Footer     from './components/Footer'
// ── Loading Fallback ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="text-white/50 text-lg">Loading...</div>
    </div>
  )
}
// ── Homepage Layout ───────────────────────────────────────────────────────────
function HomePage() {
  const [darkMode, setDarkMode] = useState(true)
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else          root.classList.remove('dark')
  }, [darkMode])
  return (
    <div className="bg-surface-900 text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Hero />
        <Statistics />
        <Services />
        <Emergency />
        <Complaints />
        <About />
      </main>
      <Footer />
    </div>
  )
}
// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public homepage */}
            <Route path="/"  element={<HomePage />} />
            {/* Auth pages — redirect to dashboard if already logged in */}
            <Route path="/login" element={
              <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute><RegisterPage /></PublicRoute>
            } />
            {/* Protected dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center text-center p-8">
                <p className="text-8xl mb-6">🏙️</p>
                <h1 className="text-white font-display font-black text-4xl mb-3">404</h1>
                <p className="text-white/50 text-lg mb-8">This page doesn&apos;t exist in Mardan Smart City.</p>
                <a href="/" className="btn-primary px-8 py-3.5">← Back to Homepage</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}
