import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, User, LogIn, LogOut } from 'lucide-react'

export default function Navbar({ user, onLogout, onHomeScroll }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleHomeScroll = (id) => {
    const doScroll = () => {
      window.dispatchEvent(new CustomEvent('home-scroll', { detail: id }))
      onHomeScroll && onHomeScroll(id)
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(doScroll, 80)
    } else {
      doScroll()
    }
    setOpen(false)
  }

  const NavLink = ({children, to, onClick}) => (
    <button onClick={onClick || (()=>navigate(to))} className="hover:text-white transition">
      {children}
    </button>
  )

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[82%]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold tracking-tight text-white drop-shadow text-lg sm:text-xl">PlayHub</Link>
        <div className="hidden md:flex items-center gap-6 text-white/90">
          <NavLink onClick={()=>handleHomeScroll('features')}>Features</NavLink>
          <NavLink to="/turfs">Turfs</NavLink>
          <NavLink onClick={()=>handleHomeScroll('pricing')}>Pricing</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-white/90"><User size={18} /> <span className="text-sm">{user.name}</span></div>
              <button onClick={onLogout} className="px-4 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex items-center gap-2"><LogOut size={16}/> Logout</button>
            </>
          ) : (
            <a href="#auth" onClick={(e)=>{e.preventDefault(); handleHomeScroll('contact');}} className="px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition flex items-center gap-2"><LogIn size={16}/> Sign in</a>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}><Menu/></button>
      </div>
      {open && (
        <div className="md:hidden mt-2 backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg rounded-2xl px-4 py-3 text-white/90">
          <div className="grid gap-2">
            <button onClick={()=>handleHomeScroll('features')} className="py-2 text-left">Features</button>
            <Link to="/turfs" onClick={()=>setOpen(false)} className="py-2">Turfs</Link>
            <button onClick={()=>handleHomeScroll('pricing')} className="py-2 text-left">Pricing</button>
            <Link to="/contact" onClick={()=>setOpen(false)} className="py-2">Contact</Link>
            {user ? (
              <button onClick={onLogout} className="py-2 text-left">Logout</button>
            ) : (
              <a href="#auth" onClick={(e)=>{e.preventDefault(); handleHomeScroll('contact');}} className="py-2">Sign in</a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}