import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNav } from '@/components/layout/TopNav'
import { POMetricCards } from '@/components/dashboard/product-owner/POMetricCards'
import { POPlantillas } from '@/components/dashboard/product-owner/POPlantillas'
import { ResumenAreas } from '@/components/dashboard/product-owner/ResumenAreas'
import { DetalleProyectoModal } from '@/components/dashboard/product-owner/DetalleProyectoModal'
import { ChevronRight } from 'lucide-react'
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

  // DB tiene tipos desactualizados — usamos any para las queries directas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Empresas asociadas al PO
  const { data: empresaLinks } = await db
    .from('movusuarioempresa')
    .select('id_mae_empresa, maeempresa(nombre_empresa)')
    .eq('id_mae_usuario', user.id)
    .eq('activo', true)

  const empresas: Array<{ id: string; nombre: string }> = (empresaLinks ?? []).map((e: any) => ({
    id: e.id_mae_empresa as string,
    nombre: (e.maeempresa as { nombre_empresa: string } | null)?.nombre_empresa ?? '',
  }))

  // Proyecto activo del PO
  const { data: proyecto } = await db
    .from('maeproyecto')
    .select('id_mae_proyecto, nombre_proyecto, estado, estado_proceso, id_mae_empresa, fecha_inicio, fecha_fin_estimada')
    .eq('id_mae_usuario_po', user.id)
    .eq('estado', 'Activo')
    .maybeSingle()

  // Notificaciones no leídas
  const { count: notifCount } = await db
    .from('movnotificacion')
    .select('*', { count: 'exact', head: true })
    .eq('id_mae_usuario', user.id)
    .eq('leida', false)

  type AreaResumen = { id_area: number; nombre_area: string; encargado: string | null; pct_avance: number }
  let areasConfiguradas: AreaResumen[] = []

  if (proyecto) {
    const [{ data: areasEmpresa }, { data: encargados }, { data: respuestas }, { data: preguntas }] =
      await Promise.all([
        db.from('movareasempresa')
          .select('id_area, catareas(nombre_area)')
          .eq('id_mae_empresa', proyecto.id_mae_empresa)
          .eq('activo', true),
        db.from('movusuariorol')
          .select('id_area, maeusuario(nombre_usuario)')
          .eq('id_mae_proyecto', proyecto.id_mae_proyecto)
          .eq('id_rol', 3)
          .eq('activo', true),
        db.from('movrespuestacuestionario')
          .select('id_area')
          .eq('id_mae_proyecto', proyecto.id_mae_proyecto)
          .not('id_area', 'is', null),
        db.from('catpregunta')
          .select('id_area')
          .eq('activo', true)
          .not('id_area', 'is', null),
      ])

    areasConfiguradas = ((areasEmpresa ?? []) as any[]).map(a => {
      const enc = ((encargados ?? []) as any[]).find((e: any) => e.id_area === a.id_area)
      const total = ((preguntas ?? []) as any[]).filter((p: any) => p.id_area === a.id_area).length
      const respondidas = ((respuestas ?? []) as any[]).filter((r: any) => r.id_area === a.id_area).length
      return {
        id_area: a.id_area,
        nombre_area: (a.catareas as { nombre_area: string } | null)?.nombre_area ?? '',
        encargado: (enc?.maeusuario as { nombre_usuario: string } | null)?.nombre_usuario ?? null,
        pct_avance: total > 0 ? Math.round((respondidas / total) * 100) : 0,
      }
    })
  }

  // Catálogo de áreas para el modal de configuración
  const { data: catalogoAreas } = await db
    .from('catareas')
    .select('id_area, nombre_area, descripcion')
    .eq('activo', true)
    .order('id_area')

  const nombreEmpresa = empresas[0]?.nombre ?? ''

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopNav
        user={appUser}
        empresas={empresas}
        notifCount={notifCount ?? 0}
      />

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-8 py-12 space-y-12">
        {/* Breadcrumb + título */}
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

        {/* Proyecto activo + modal detalle */}
        <DetalleProyectoModal
          proyecto={proyecto ? {
            id: proyecto.id_mae_proyecto,
            nombre: proyecto.nombre_proyecto,
            estado: proyecto.estado,
            estadoProceso: proyecto.estado_proceso,
            empresa: nombreEmpresa,
            fechaInicio: proyecto.fecha_inicio,
            fechaFin: proyecto.fecha_fin_estimada,
          } : null}
        />

        <POMetricCards />

        {/* Mis plantillas de cuestionario */}
        <POPlantillas />

        {/* Resumen de áreas */}
        <ResumenAreas
          areas={areasConfiguradas}
          catalogoAreas={((catalogoAreas ?? []) as any[]).map((a: any) => ({
            id_area: a.id_area as number,
            nombre_area: a.nombre_area as string,
            descripcion: (a.descripcion ?? null) as string | null,
          }))}
          proyectoId={proyecto?.id_mae_proyecto ?? ''}
          empresaId={proyecto?.id_mae_empresa ?? ''}
        />
      </main>
    </div>
  )
}
