'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, ChevronDown, LogOut, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificacionesPanel } from '@/components/layout/NotificacionesPanel'
import type { AppUser } from '@/types/user'
import type { Role } from '@/types/roles'

const ROLE_LABELS: Record<Role, string> = {
  admin:          'Admin',
  product_owner:  'Product Owner',
  encargado_area: 'Encargado · Área',
  ejecutivo:      'Ejecutivo',
  saas_admin:     'Admin SaaS',
}

interface Empresa {
  id: string
  nombre: string
}

interface TopNavProps {
  user: AppUser
  companyName?: string
  empresas?: Empresa[]
  notifCount?: number
}

export function TopNav({ user, companyName, empresas = [], notifCount = 0 }: TopNavProps) {
  const router = useRouter()
  const role = user.user_metadata.role
  const [empresaActiva, setEmpresaActiva] = useState<Empresa | null>(
    empresas.length > 0 ? empresas[0] : null
  )
  const [selectorOpen, setSelectorOpen] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node))
        setSelectorOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const nombreEmpresa = empresaActiva?.nombre ?? companyName

  return (
    <nav className="glass-panel sticky top-0 z-50 shadow-[0_1px_0_rgba(27,58,92,0.06)] border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full px-8 max-w-screen-2xl mx-auto h-16">
        {/* Brand + selector empresa */}
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_datcore.png" alt="DatCore" className="h-8 w-auto" />

          {nombreEmpresa && (
            <div ref={selectorRef} className="relative hidden lg:block">
              <button
                onClick={() => setSelectorOpen(o => !o)}
                className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-md hover:bg-surface-container cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-on-surface-variant">{nombreEmpresa}</span>
                {empresas.length > 1 && (
                  <ChevronDown
                    size={14}
                    className={`text-outline transition-transform ${selectorOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {selectorOpen && empresas.length > 1 && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-xl z-50 overflow-hidden">
                  <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Seleccionar empresa
                  </p>
                  {empresas.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => { setEmpresaActiva(emp); setSelectorOpen(false) }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span className={empresaActiva?.id === emp.id ? 'font-bold text-primary' : ''}>
                        {emp.nombre}
                      </span>
                      {empresaActiva?.id === emp.id && <Check size={13} className="text-secondary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trailing actions */}
        <div className="flex items-center gap-4">
          <NotificacionesPanel initialCount={notifCount} usuarioId={user.id} />

          <button className="text-outline hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-low">
            <Settings size={20} />
          </button>

          <div className="flex items-center gap-3 pl-4 ml-1 border-l border-surface-variant">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
              {(user.user_metadata.nombre ?? user.email).charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-bold text-on-surface leading-tight">
                {user.user_metadata.nombre ?? user.email}
              </span>
              <span className="text-[0.65rem] font-bold tracking-wider uppercase text-primary-container bg-primary-fixed px-1.5 py-0.5 rounded w-fit mt-0.5">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-outline hover:text-error transition-colors p-1.5 rounded-full hover:bg-surface-container-low"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
