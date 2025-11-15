export default function ContactPage(){
  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <div className="h-40 bg-gradient-to-b from-[#0B1020] to-transparent"/>
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact</h1>
        <p className="text-white/70 mb-8">We'd love to hear from you. Reach us at hello@playhub.app</p>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <form className="grid gap-3">
            <input placeholder="Your name" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900"/>
            <input placeholder="Email" className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900"/>
            <textarea placeholder="Message" rows={5} className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900"/>
            <button className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}