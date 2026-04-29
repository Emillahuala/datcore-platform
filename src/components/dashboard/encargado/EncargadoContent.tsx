'use client'

import Link from 'next/link'
import { FileText, ChevronRight, Clock, CircleDot, CheckCircle2, LogOut } from 'lucide-react'
import type { AppUser } from '@/types/user'
import { FORMULARIOS_MOCK } from '@/lib/formularios-data'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STATUS_CONFIG = {
  pendiente:    { label: 'Pendiente',    Icon: Clock,          color: 'text-on-surface-variant', bg: 'bg-surface-container' },
  en_progreso:  { label: 'En progreso',  Icon: CircleDot,      color: 'text-secondary',          bg: 'bg-secondary/10' },
  completado:   { label: 'Completado',   Icon: CheckCircle2,   color: 'text-[#2e7d32]',          bg: 'bg-[#e8f5e9]' },
  borrador:     { label: 'Borrador',     Icon: FileText,       color: 'text-on-surface-variant', bg: 'bg-surface-variant' },
}

export function EncargadoContent({ user }: { user: AppUser }) {
  const router = useRouter()
  const nombre = user.user_metadata?.nombre ?? user.email

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex-1 flex flex-col md:ml-64">
      {/* TopBar */}
      <header className="sticky top-0 z-10 flex justify-between items-center px-8 h-16 bg-surface-container-low/80 backdrop-blur-sm border-b border-outline-variant/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_datcore.png" alt="DatCore" className="h-8 w-auto" />
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold text-secondary shadow-ambient-sm border border-outline-variant/20">
            Encargado · RRHH
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold select-none">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} title="Cerrar sesión" className="p-1.5 text-outline hover:text-on-surface transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-10 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Área: Recursos Humanos
          </p>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Mis formularios</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Completa los formularios asignados para el cumplimiento de la Ley 21.719.
          </p>
        </div>

        {/* Form list */}
        <div className="space-y-3">
          {FORMULARIOS_MOCK.map((f) => {
            const cfg = STATUS_CONFIG[f.status]
            const { Icon } = cfg
            const btnLabel = f.status === 'completado' ? 'Ver respuestas' : f.status === 'en_progreso' ? 'Continuar' : 'Completar'

            return (
              <Link
                key={f.id}
                href={`/encargado/formulario/${f.id}`}
                className="group flex items-center gap-4 bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-md transition-all border border-transparent hover:border-outline-variant/30"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <FileText size={20} className="text-secondary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <Icon size={10} />
                      {cfg.label}
                    </span>
                    <span className="text-[0.65rem] text-on-surface-variant">
                      {f.secciones.length} secciones
                    </span>
                  </div>
                  <h3 className="font-semibold text-on-surface text-sm leading-snug">{f.titulo}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{f.descripcion}</p>

                  {/* Progress bar for in-progress forms */}
                  {f.progreso > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${f.progreso}%` }} />
                      </div>
                      <span className="text-[0.65rem] font-bold text-on-surface-variant">{f.progreso}%</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:block text-xs font-bold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    {btnLabel}
                  </span>
                  <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
