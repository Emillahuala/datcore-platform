import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/layout/TopNav'
import { POMetricCards } from '@/components/dashboard/product-owner/POMetricCards'
import { POPlantillas } from '@/components/dashboard/product-owner/POPlantillas'
import { ChevronRight, Briefcase, ArrowRight } from 'lucide-react'
import type { AppUser } from '@/types/user'

export default async function ProductOwnerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'product_owner') redirect('/login')

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopNav user={appUser} companyName="Constructora Aysén Ltda." />

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <span>Inicio</span>
            <ChevronRight size={14} />
            <span className="text-primary font-bold">Panel de control</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-primary text-[2.75rem] font-bold leading-tight tracking-tight">
              Panel de control
            </h1>
            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Vista de proyecto — Product Owner
            </span>
          </div>
        </header>

        {/* Active project card */}
        <div className="flex items-center gap-4 rounded-lg bg-surface-container-low p-6 border border-outline-variant/15 shadow-ambient relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />
          <div className="flex items-center justify-center size-12 rounded-full bg-primary-container/10 text-primary-container">
            <Briefcase size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-primary text-lg font-bold leading-tight">
              Proyecto activo: Cumplimiento Ley 21.719 — Constructora Aysén Ltda.
            </p>
            <p className="text-on-surface-variant text-sm">Product Owner Asignado</p>
          </div>
          <div className="ml-auto">
            <button className="text-secondary font-bold text-sm flex items-center gap-2 hover:opacity-80 transition-opacity">
              Ver detalles del proyecto <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <POMetricCards />
        <POPlantillas />
      </main>
    </div>
  )
}
