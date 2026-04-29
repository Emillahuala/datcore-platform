'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, FileText, BarChart3,
  Settings, FolderOpen, HelpCircle, LogOut, FolderKanban,
} from 'lucide-react'
import { DatCoreLogo } from './DatCoreLogo'
import { RoleBadge } from './RoleBadge'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types/roles'
import type { AppUser } from '@/types/user'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { href: '/admin',                icon: LayoutDashboard, label: 'Panel' },
    { href: '/admin/empresas',       icon: Building2,       label: 'Empresas' },
    { href: '/admin/usuarios',       icon: Users,           label: 'Usuarios' },
    { href: '/admin/cuestionarios',  icon: FileText,        label: 'Cuestionarios' },
    { href: '/admin/reportes',       icon: BarChart3,       label: 'Reportes' },
    { href: '/admin/configuracion',  icon: Settings,        label: 'Configuración' },
  ],
  product_owner: [
    { href: '/product-owner',             icon: LayoutDashboard, label: 'Mi Panel' },
    { href: '/product-owner/proyectos',   icon: FolderOpen,      label: 'Mis Proyectos' },
    { href: '/product-owner/plantillas',  icon: FileText,        label: 'Plantillas' },
    { href: '/product-owner/equipo',      icon: Users,           label: 'Mi Equipo' },
    { href: '/product-owner/ayuda',       icon: HelpCircle,      label: 'Ayuda' },
  ],
  encargado_area: [
    { href: '/encargado',                  icon: LayoutDashboard, label: 'Mi Panel' },
    { href: '/encargado/cuestionarios',    icon: FileText,        label: 'Mis Cuestionarios' },
    { href: '/encargado/ayuda',            icon: HelpCircle,      label: 'Ayuda' },
  ],
  ejecutivo: [
    { href: '/ejecutivo',           icon: LayoutDashboard, label: 'Mi Panel' },
    { href: '/ejecutivo/proyectos', icon: FolderKanban,    label: 'Mis Proyectos' },
    { href: '/ejecutivo/ayuda',     icon: HelpCircle,      label: 'Ayuda' },
  ],
  saas_admin: [
    { href: '/saas-admin',                    icon: LayoutDashboard, label: 'Dashboard SaaS' },
    { href: '/saas-admin/consultoras',        icon: Building2,       label: 'Consultoras' },
    { href: '/saas-admin/estadisticas',       icon: BarChart3,       label: 'Estadísticas' },
    { href: '/saas-admin/facturacion',        icon: FileText,        label: 'Facturación' },
    { href: '/saas-admin/configuracion',      icon: Settings,        label: 'Configuración' },
  ],
}

interface SidebarProps {
  user: AppUser
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const role = user.user_metadata.role
  const items = NAV_ITEMS[role]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-brand-navy flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <DatCoreLogo />
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10',
              ].join(' ')}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <RoleBadge role={role} />
          <p className="text-xs text-white/60 truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
