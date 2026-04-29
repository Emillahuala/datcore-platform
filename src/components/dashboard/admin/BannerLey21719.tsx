import { TriangleAlert, ArrowRight } from 'lucide-react'
import { getDaysUntil, LEY_21719_DATE } from '@/lib/utils'

export function BannerLey21719() {
  const days = getDaysUntil(LEY_21719_DATE)
  return (
    <div className="flex items-stretch rounded-md overflow-hidden border border-primary/15 shadow-ambient-sm">
      {/* Days block */}
      <div className="bg-primary px-6 py-4 flex items-center gap-4 shrink-0">
        <span
          className="text-3xl font-bold tabular-nums leading-none"
          style={{ color: '#2AADAD' }}
        >
          {days}
        </span>
        <div>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">días</p>
          <p className="text-xs text-white/70 whitespace-nowrap">para Ley 21.719</p>
        </div>
      </div>

      {/* Message block */}
      <div className="bg-primary/[0.04] border-l border-primary/10 px-6 py-4 flex-1 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <TriangleAlert size={16} className="text-tertiary-container shrink-0" />
          <p className="text-sm text-on-surface">
            <span className="font-semibold">3 empresas</span> requieren actualización de políticas de privacidad antes del{' '}
            <span className="font-semibold">1 dic 2026</span>.
          </p>
        </div>
        <a
          href="#"
          className="text-secondary font-semibold text-sm flex items-center gap-1 whitespace-nowrap hover:underline"
        >
          Ver plan <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
