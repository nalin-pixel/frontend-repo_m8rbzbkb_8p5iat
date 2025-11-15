import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TurfsPage() {
  const [turfs, setTurfs] = useState([])

  useEffect(()=>{
    fetch(`${backend}/turfs`).then(r=>r.json()).then(setTurfs).catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <div className="h-40 bg-gradient-to-b from-[#0B1020] to-transparent"/>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">All Turfs</h1>
        <p className="text-white/70 mb-8">Browse available venues and check their details.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {turfs.length === 0 && (
            <div className="col-span-full text-white/70">No turfs yet. Admins can add from dashboard.</div>
          )}
          {turfs.map((t)=> (
            <div key={t.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:translate-y-[-4px] transition-all">
              <div className="h-40 bg-gradient-to-br from-cyan-400/40 to-blue-600/30"/>
              <div className="p-4">
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-white/70 text-sm flex items-center gap-2"><MapPin size={16}/> {t.location}</div>
                <div className="mt-2 text-white/80 text-sm">${t.price_per_hour}/hr</div>
                <button className="mt-3 w-full px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-medium">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}