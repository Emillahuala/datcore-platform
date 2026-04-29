'use client'

import { useRouter } from 'next/navigation'
import { Bell, Settings, ChevronDown, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { AppUser } from '@/types/user'
import type { Role } from '@/types/roles'

const ROLE_LABELS: Record<Role, string> = {
  admin:          'Admin',
  product_owner:  'Product Owner',
  encargado_area: 'Encargado · Área',
  ejecutivo:      'Ejecutivo',
}

interface TopNavProps {
  user: AppUser
  companyName?: string
}

export function TopNav({ user, companyName }: TopNavProps) {
  const router = useRouter()
  const role = user.user_metadata.role

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 shadow-[0_1px_0_rgba(27,58,92,0.06)] border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full px-8 max-w-screen-2xl mx-auto h-16">
        {/* Brand */}
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_datcore.png" alt="DatCore" className="h-8 w-auto" />
          {companyName && (
            <div className="hidden lg:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-md hover:bg-surface-container cursor-pointer transition-colors">
              <span className="text-sm font-medium text-on-surface-variant">{companyName}</span>
              <ChevronDown size={14} className="text-outline" />
            </div>
          )}
        </div>

        {/* Trailing actions */}
        <div className="flex items-center gap-4">
          <button className="text-outline hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-low">
            <Bell size={20} />
          </button>
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
