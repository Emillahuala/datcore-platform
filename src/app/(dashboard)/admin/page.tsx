import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/layout/TopNav'
import { BannerLey21719 } from '@/components/dashboard/admin/BannerLey21719'
import { AdminMetricCards } from '@/components/dashboard/admin/AdminMetricCards'
import { EmpresasTable } from '@/components/dashboard/admin/EmpresasTable'
import { PlantillasGrid } from '@/components/dashboard/admin/PlantillasGrid'
import { AdminActions } from '@/components/dashboard/admin/AdminActions'
import { ChevronRight } from 'lucide-react'
import type { AppUser } from '@/types/user'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/login')

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopNav user={appUser} companyName="Todas las empresas" />

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-outline-variant font-medium">
            <span>Inicio</span>
            <ChevronRight size={14} />
            <span className="text-on-surface">Panel de control</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-[2.75rem] font-bold tracking-tight text-primary leading-none">
                  Panel de control
                </h1>
                <span className="bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-ambient-sm">
                  Vista global — Admin
                </span>
              </div>
              <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed mt-4">
                Estado general de cumplimiento, métricas clave y alertas de seguridad para todas las organizaciones.
              </p>
            </div>
            <AdminActions />
          </div>
        </header>

        <BannerLey21719 />
        <AdminMetricCards />
        <EmpresasTable />
        <PlantillasGrid />
      </main>
    </div>
  )
}
