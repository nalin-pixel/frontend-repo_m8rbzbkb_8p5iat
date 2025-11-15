import { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Menu, User, LogIn, LogOut, CalendarDays, MapPin, Shield, ChevronDown } from 'lucide-react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function FloatingNavbar({ user, onLogout, onClickScroll }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[82%]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="#hero" className="font-bold tracking-tight text-white drop-shadow text-lg sm:text-xl">PlayHub</a>
        <div className="hidden md:flex items-center gap-6 text-white/90">
          <button onClick={() => onClickScroll('features')} className="hover:text-white transition">Features</button>
          <button onClick={() => onClickScroll('turfs')} className="hover:text-white transition">Turfs</button>
          <button onClick={() => onClickScroll('pricing')} className="hover:text-white transition">Pricing</button>
          <button onClick={() => onClickScroll('contact')} className="hover:text-white transition">Contact</button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-white/90"><User size={18} /> <span className="text-sm">{user.name}</span></div>
              <button onClick={onLogout} className="px-4 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex items-center gap-2"><LogOut size={16}/> Logout</button>
            </>
          ) : (
            <a href="#auth" className="px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition flex items-center gap-2"><LogIn size={16}/> Sign in</a>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}><Menu/></button>
      </div>
      {open && (
        <div className="md:hidden mt-2 backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg rounded-2xl px-4 py-3 text-white/90">
          <div className="grid gap-2">
            <a onClick={() => onClickScroll('features')} href="#features" className="py-2">Features</a>
            <a onClick={() => onClickScroll('turfs')} href="#turfs" className="py-2">Turfs</a>
            <a onClick={() => onClickScroll('pricing')} href="#pricing" className="py-2">Pricing</a>
            <a onClick={() => onClickScroll('contact')} href="#contact" className="py-2">Contact</a>
            {user ? (
              <button onClick={onLogout} className="py-2 text-left">Logout</button>
            ) : (
              <a href="#auth" className="py-2">Sign in</a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ParallaxSection({ id, title, subtitle, children }) {
  return (
    <section id={id} className="relative px-6 sm:px-10 py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/30 pointer-events-none"/>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            {title} <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><Shield size={16}/> PlayHub Secure</span>
          </h2>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        <div className="relative">{children}</div>
      </div>
    </section>
  )
}

function AuthPanel({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        const res = await fetch(`${backend}/auth/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        if (!res.ok) throw new Error(await res.text())
      }
      const form = new URLSearchParams({ username: email, password })
      const res2 = await fetch(`${backend}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form })
      if (!res2.ok) throw new Error(await res2.text())
      const data = await res2.json()
      localStorage.setItem('token', data.access_token)
      const me = await fetch(`${backend}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const user = await me.json()
      onAuthed(user)
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="auth" className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2 text-gray-800 mb-4">
        <User size={18}/> <span className="font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</span>
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        {mode === 'register' && (
          <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Full name" className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        )}
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Email" className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Password" className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        <button disabled={loading} className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:opacity-90 transition">{loading ? 'Please wait...' : (mode==='login' ? 'Sign in' : 'Sign up')}</button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'register':'login')} className="mt-3 text-sm text-gray-600 hover:text-gray-800">{mode==='login'?"Don't have an account? Create one":"Already have an account? Sign in"}</button>
    </div>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const turfsRef = useRef(null)
  const pricingRef = useRef(null)
  const contactRef = useRef(null)

  const [user, setUser] = useState(null)
  const [turfs, setTurfs] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${backend}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r=>r.ok?r.json():null)
        .then(u=>u && setUser(u))
    }
    fetch(`${backend}/turfs`).then(r=>r.json()).then(setTurfs).catch(()=>{})
  }, [])

  const smoothScroll = (section) => {
    const map = { hero: heroRef, features: featuresRef, turfs: turfsRef, pricing: pricingRef, contact: contactRef }
    const ref = map[section]
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return (
    <div className="min-h-screen bg-[#0B1020] text-white scroll-smooth">
      <FloatingNavbar user={user} onLogout={logout} onClickScroll={smoothScroll} />

      {/* Hero */}
      <section id="hero" ref={heroRef} className="relative h-[95svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1020]/20 to-[#0B1020] pointer-events-none" />
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 sm:px-10 max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 text-cyan-300/90 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-4">
              <Shield size={16}/> <span className="text-sm">Secure bookings</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">PlayHub — book premium turfs with style</h1>
            <p className="mt-4 text-white/80 max-w-xl">A futuristic, smooth experience for discovering, scheduling, and managing your sports sessions. Auth built-in. Admin ready.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={()=>smoothScroll('turfs')} className="px-5 py-3 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-semibold">Explore Turfs</button>
              <a href="#auth" className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-semibold">Get Started</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 animate-bounce flex items-center gap-2"><ChevronDown/> Scroll</div>
      </section>

      {/* Features with parallax cards */}
      <ParallaxSection id="features" title="Why PlayHub" subtitle="Designed for speed, security, and stunning visuals">
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            icon: <CalendarDays/>, title: 'Effortless Scheduling', desc: 'Real-time slot conflict checks and instant confirmation.'
          },{
            icon: <MapPin/>, title: 'Prime Locations', desc: 'Discover active turfs near you with rich details.'
          },{
            icon: <Shield/>, title: 'Built-in Auth', desc: 'JWT-based auth keeps your account secure.'
          }].map((f, i)=> (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur group hover:translate-y-[-4px] transition-all">
              <div className="text-cyan-300 mb-3">{f.icon}</div>
              <div className="font-semibold text-lg">{f.title}</div>
              <div className="text-white/70 text-sm mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </ParallaxSection>

      {/* Turfs */}
      <ParallaxSection id="turfs" title="Featured Turfs" subtitle="Handpicked spaces for your next game">
        <div className="grid md:grid-cols-3 gap-6">
          {turfs.length === 0 && (
            <div className="col-span-full text-white/70">No turfs yet. Admins can add from dashboard.</div>
          )}
          {turfs.map((t)=>(
            <div key={t.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <div className="h-40 bg-gradient-to-br from-cyan-400/40 to-blue-600/30"/>
              <div className="p-4">
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-white/70 text-sm flex items-center gap-2"><MapPin size={16}/> {t.location}</div>
                <div className="mt-2 text-white/80 text-sm">${t.price_per_hour}/hr</div>
                <button onClick={()=>window.alert('Login to book')}
                  className="mt-3 w-full px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-medium">Book</button>
              </div>
            </div>
          ))}
        </div>
      </ParallaxSection>

      {/* Pricing */}
      <ParallaxSection id="pricing" title="Simple Pricing" subtitle="Transparent rates and zero hidden fees">
        <div className="grid md:grid-cols-3 gap-6">
          {[{name:'Casual',price:'Free', features:['Browse turfs','Create account']},{name:'Player',price:'$5/mo',features:['Priority support','Early access']},{name:'Club',price:'$29/mo',features:['Team management','Admin tools']}].map((p,i)=>(
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="text-xl font-semibold">{p.name}</div>
              <div className="text-4xl mt-2 font-bold">{p.price}</div>
              <ul className="mt-4 space-y-2 text-white/70 text-sm">
                {p.features.map((f,idx)=>(<li key={idx}>• {f}</li>))}
              </ul>
              <button className="mt-6 w-full px-4 py-2 rounded-xl bg-white text-gray-900">Choose</button>
            </div>
          ))}
        </div>
      </ParallaxSection>

      {/* Contact + Auth */}
      <ParallaxSection id="contact" title="Get in touch" subtitle="Questions, partnerships, or venue onboarding?">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="font-semibold mb-2">Contact</div>
            <p className="text-white/70 text-sm">Email us at hello@playhub.app</p>
          </div>
          <AuthPanel onAuthed={setUser} />
        </div>
      </ParallaxSection>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 text-white/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>© {new Date().getFullYear()} PlayHub</div>
          <div className="flex items-center gap-3">
            <a href="#hero" onClick={(e)=>{e.preventDefault();smoothScroll('hero')}} className="hover:text-white">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
