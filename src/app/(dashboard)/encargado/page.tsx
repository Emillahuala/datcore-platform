import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { EncargadoSidebar } from '@/components/dashboard/encargado/EncargadoSidebar'
import { EncargadoContent } from '@/components/dashboard/encargado/EncargadoContent'
import type { AppUser } from '@/types/user'
import type { AreaEncargado } from '@/types/cuestionario'

const TOTAL_PREGUNTAS_POR_AREA = 12

export default async function EncargadoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'encargado_area') redirect('/login')

  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  // 1. Todos los roles activos del encargado (puede haber múltiples áreas y proyectos)
  const { data: roles } = await db
    .from('movusuariorol')
    .select('id_area, id_mae_proyecto, id_mae_empresa')
    .eq('id_mae_usuario', user.id)
    .eq('id_rol', 3)
    .eq('activo', true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const areaIds: number[]     = [...new Set<number>((roles ?? []).map((r: any) => r.id_area as number).filter((x: number) => x != null))]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proyectoIds: string[] = [...new Set<string>((roles ?? []).map((r: any) => r.id_mae_proyecto as string).filter((x: string) => x != null))]

  // 2. Cargar catálogos + respuestas + estados en paralelo
  const [
    { data: areasInfo },
    { data: proyectosInfo },
    { data: respuestas },
    { data: estados },
  ] = await Promise.all([
    areaIds.length > 0
      ? db.from('catareas').select('id_area, nombre_area').in('id_area', areaIds)
      : Promise.resolve({ data: [] }),
    proyectoIds.length > 0
      ? db.from('maeproyecto').select('id_mae_proyecto, nombre_proyecto').in('id_mae_proyecto', proyectoIds)
      : Promise.resolve({ data: [] }),
    areaIds.length > 0
      ? db
          .from('movrespuestacuestionario')
          .select('id_area, id_mae_proyecto')
          .eq('id_mae_usuario', user.id)
          .eq('id_tipo_movimiento', 2)
          .in('id_area', areaIds)
      : Promise.resolve({ data: [] }),
    areaIds.length > 0
      ? db
          .from('movcuestionarioestado')
          .select('id_area, id_mae_proyecto, estado')
          .eq('id_mae_usuario', user.id)
          .in('id_mae_proyecto', proyectoIds)
      : Promise.resolve({ data: [] }),
  ])

  // 3. Construir lista — un ítem por cada combinación (área, proyecto)
  const areas: AreaEncargado[] = (roles ?? []).map(
    (rol: { id_area: number; id_mae_proyecto: string; id_mae_empresa: string }) => {
      const areaInfo     = (areasInfo     ?? []).find((a: { id_area: number })       => a.id_area         === rol.id_area)
      const proyectoInfo = (proyectosInfo ?? []).find((p: { id_mae_proyecto: string }) => p.id_mae_proyecto === rol.id_mae_proyecto)
      const estadoRow    = (estados       ?? []).find(
        (e: { id_area: number; id_mae_proyecto: string }) =>
          e.id_area === rol.id_area && e.id_mae_proyecto === rol.id_mae_proyecto
      )
      const respondidas = (respuestas ?? []).filter(
        (r: { id_area: number; id_mae_proyecto: string }) =>
          r.id_area === rol.id_area && r.id_mae_proyecto === rol.id_mae_proyecto
      ).length

      const progreso    = Math.round((respondidas / TOTAL_PREGUNTAS_POR_AREA) * 100)
      const estado: AreaEncargado['estado'] =
        estadoRow?.estado ?? (respondidas > 0 ? 'en_progreso' : 'pendiente')

      return {
        id_area:         rol.id_area,
        nombre_area:     areaInfo?.nombre_area       ?? 'Área',
        id_mae_proyecto: rol.id_mae_proyecto,
        nombre_proyecto: proyectoInfo?.nombre_proyecto ?? 'Proyecto',
        id_mae_empresa:  rol.id_mae_empresa,
        estado,
        progreso,
        total_preguntas: TOTAL_PREGUNTAS_POR_AREA,
        respondidas,
      }
    }
  )

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex antialiased">
      <EncargadoSidebar user={appUser} areas={areas} />
      <EncargadoContent user={appUser} areas={areas} />
    </div>
  )
}
