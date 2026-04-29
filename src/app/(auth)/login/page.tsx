import Image from 'next/image'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased">

      {/* ── Left panel ── */}
      <div className="flex w-full md:w-[45%] flex-col justify-between p-10 lg:p-14 relative overflow-hidden" 
           style={{ backgroundColor: '#1B3A5C' }}>

        {/* Dot-grid SVG pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="rgba(110,207,209,0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <line x1="-10%" y1="38%" x2="110%" y2="55%" stroke="rgba(46,138,208,0.07)" strokeWidth="1" />
          <line x1="-10%" y1="62%" x2="110%" y2="79%" stroke="rgba(46,138,208,0.05)" strokeWidth="1" />
        </svg>

        {/* Teal radial glow — top right */}
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(46,138,208,0.45) 0%, transparent 70%)' }} />

        {/* Bottom left corner accent */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(110,207,209,0.35) 0%, transparent 70%)' }} />

        {/* ── Logo ── */}
        <div className="relative z-10 animate-fade-in">
          <Image
            src="/logo_datcore_shadow.png"
            alt="DatCore"
            width={420}
            height={120}
            priority
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* ── Main copy ── */}
        <div className="relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-5 animate-slide-right delay-100">
            <div className="h-px w-6 bg-secondary" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-secondary">
              Gobierno de Datos · Chile
            </span>
          </div>

          {/* Display headline */}
          <h2 className="font-sans not-italic text-5xl lg:text-[3.6rem] font-semibold leading-[1.08] mb-6 text-white animate-fade-up delay-150">
            Protegemos<br />
            lo que<br />
            <span style={{ color: '#6ECFD1' }}>importa.</span>
          </h2>

          <p className="text-sm text-white/55 leading-relaxed mb-10 max-w-[280px] animate-fade-up delay-200">
            Cumpla con la Ley 21.719 sin necesidad de un departamento de TI.
            Centralice, asegure y audite su información corporativa.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 flex gap-6 text-[0.7rem] text-white/30 animate-fade-in delay-400">
          <a href="#" className="hover:text-white/60 transition-colors tracking-wide">Privacidad</a>
          <a href="#" className="hover:text-white/60 transition-colors tracking-wide">Términos</a>
          <span>© 2026 DatCore</span>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center relative"
        style={{ background: '#E9E9EA' }}>

        {/* Subtle grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }} />

        {/* Mobile logo */}
        <div className="md:hidden absolute top-8 left-8">
          <Image
            src="/logo_datcore_shadow.png"
            alt="DatCore"
            width={320}
            height={96}
            priority
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="w-full max-w-[400px] px-8 md:px-0">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
