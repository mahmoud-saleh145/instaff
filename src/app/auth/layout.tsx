export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#677ce7 0%,#784ca3 100%)" }}>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">IS</div>
          <span className="text-white font-bold text-xl tracking-tight">InStaff</span>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight">Find your next<br /><span className="text-yellow-300">quick gig</span> today</h2>
            <p className="text-white/70 text-lg leading-relaxed">Connecting workers with temporary jobs, daily shifts, and part-time opportunities — fast.</p>
          </div>
          <div className="space-y-3">
            {[{ e:"⚡",t:"Apply in seconds"},{e:"🗓️",t:"Daily & weekly shifts"},{e:"📍",t:"Local opportunities"},{e:"💰",t:"Get paid quickly"}].map(f=>(
              <div key={f.t} className="flex items-center gap-3"><span className="text-xl">{f.e}</span><span className="text-white/90 font-medium">{f.t}</span></div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="text-white/90 text-sm leading-relaxed italic">"Found a weekend cashier job in under 10 minutes. InStaff is exactly what I needed!"</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
              <div><p className="text-white text-xs font-semibold">Maria S.</p><p className="text-white/60 text-xs">Part-time worker</p></div>
            </div>
          </div>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
