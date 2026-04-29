'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, HelpCircle, LogOut, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { AppUser } from '@/types/user'
import type { AreaEncargado } from '@/types/cuestionario'

interface Props {
  user: AppUser
  areas: AreaEncargado[]
}

const NAV_ITEMS = [
  { href: '/encargado',        icon: LayoutDashboard, label: 'Panel' },
  { href: '/encargado/ayuda',  icon: HelpCircle,      label: 'Ayuda' },
]

export function EncargadoSidebar({ user, areas }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Etiqueta de área(s) para el sidebar
  const areaLabel =
    areas.length === 0  ? 'Sin áreas asignadas' :
    areas.length === 1  ? areas[0].nombre_area   :
    `${areas.length} áreas asignadas`

  return (
    <nav className="hidden md:flex flex-col py-8 px-4 space-y-4 bg-primary w-64 fixed h-full z-40">

      {/* Logo */}
      <div className="px-2 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_datcore_shadow.png" alt="DatCore" className="h-14 w-auto" />
      </div>

      {/* Info de usuario */}
      <div className="px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {(user.user_metadata.nombre ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/90 leading-tight truncate">
              {user.user_metadata.nombre ?? user.email.split('@')[0]}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Layers size={9} className="text-white/40 shrink-0" />
              <p className="text-[0.6rem] text-white/40 uppercase tracking-wider truncate">
                {areaLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10 mx-2 mb-2" />

      {/* Navegación */}
      <div className="flex-1 flex flex-col space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === '/encargado'
              ? pathname === '/encargado'
              : pathname.startsWith(href)

          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-secondary' : ''} />
              {label}
            </a>
          )
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors px-3 py-2 w-full"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
