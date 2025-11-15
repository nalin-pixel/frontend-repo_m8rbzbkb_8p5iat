import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Layout(){
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const contactRef = useRef(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) return
    fetch((import.meta.env.VITE_BACKEND_URL||'http://localhost:8000') + '/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.ok?r.json():null).then(u=>u && setUser(u))
  }, [])

  const smoothScroll = (section) => {
    const map = { hero: heroRef, features: featuresRef, pricing: pricingRef, contact: contactRef }
    const ref = map[section]
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  useEffect(()=>{
    const handler = (e)=> smoothScroll(e.detail)
    window.addEventListener('home-scroll', handler)
    return ()=> window.removeEventListener('home-scroll', handler)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Navbar user={user} onLogout={logout} onHomeScroll={smoothScroll} />
      <Outlet context={{ refs:{heroRef, featuresRef, pricingRef, contactRef}, setUser }} />
    </div>
  )
}