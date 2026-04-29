'use client'

import { useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, HelpCircle, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { AppUser } from '@/types/user'

const NAV_ITEMS = [
  { href: '/encargado',              icon: LayoutDashboard, label: 'Panel',             active: true  },
  { href: '/encargado/cuestionarios',icon: FileText,        label: 'Mis Cuestionarios', active: false },
  { href: '/encargado/ayuda',        icon: HelpCircle,      label: 'Ayuda',             active: false },
]

export function EncargadoSidebar({ user }: { user: AppUser }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="hidden md:flex flex-col py-8 px-4 space-y-4 bg-primary w-64 fixed h-full z-40">
      {/* Logo */}
      <div className="px-2 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_datcore_shadow.png" alt="DatCore" className="h-14 w-auto" />
      </div>

      {/* User info */}
      <div className="px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {(user.user_metadata.nombre ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-white/90 leading-tight">
              {user.user_metadata.nombre ?? user.email.split('@')[0]}
            </p>
            <p className="text-[0.6rem] text-white/40 uppercase tracking-wider">Recursos Humanos</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10 mx-2 mb-2" />

      {/* Nav links */}
      <div className="flex-1 flex flex-col space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, active }) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-white/15 text-white font-semibold'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={16} className={active ? 'text-secondary' : ''} />
            {label}
          </a>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors px-3 py-2 w-full"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
