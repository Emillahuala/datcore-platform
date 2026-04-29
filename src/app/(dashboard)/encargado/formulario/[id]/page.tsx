import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { EncargadoSidebar } from '@/components/dashboard/encargado/EncargadoSidebar'
import { FormularioWizardReal } from '@/components/dashboard/encargado/FormularioWizardReal'
import type { AppUser } from '@/types/user'
import type { CuestionarioData, PreguntaReal } from '@/types/cuestionario'

export default async function FormularioPage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ proyecto?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'encargado_area') redirect('/login')

  const [{ id }, { proyecto: proyectoParam }] = await Promise.all([params, searchParams])

  const id_area = parseInt(id)
  if (isNaN(id_area) || id_area < 1) redirect('/encargado')

  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any

  // Verificar acceso — si viene el proyecto en query param, usarlo para filtrar
  const rolQuery = db
    .from('movusuariorol')
    .select('id_mae_proyecto, id_mae_empresa')
    .eq('id_mae_usuario', user.id)
    .eq('id_rol', 3)
    .eq('id_area', id_area)
    .eq('activo', true)

  if (proyectoParam) rolQuery.eq('id_mae_proyecto', proyectoParam)

  const { data: rol } = await rolQuery.maybeSingle()
  if (!rol) redirect('/encargado')

  const { id_mae_proyecto, id_mae_empresa } = rol

  // Cargar datos en paralelo
  const [
    { data: areaData },
    { data: preguntasRaw },
    { data: respuestasExistentes },
    { data: estadoRow },
  ] = await Promise.all([
    db.from('catareas').select('nombre_area').eq('id_area', id_area).single(),
    db.rpc('sp_obtiene_cuestionario', { p_id_cat_scoring: 2, p_id_area: id_area }),
    db
      .from('movrespuestacuestionario')
      .select('id_cat_pregunta, id_cat_respuesta')
      .eq('id_mae_usuario', user.id)
      .eq('id_mae_proyecto', id_mae_proyecto)
      .eq('id_area', id_area)
      .eq('id_tipo_movimiento', 2),
    db
      .from('movcuestionarioestado')
      .select('estado')
      .eq('id_mae_usuario', user.id)
      .eq('id_mae_proyecto', id_mae_proyecto)
      .eq('id_area', id_area)
      .maybeSingle(),
  ])

  // Mapa de respuestas guardadas
  const respuestas_guardadas: Record<number, number> = {}
  for (const r of (respuestasExistentes ?? [])) {
    respuestas_guardadas[r.id_cat_pregunta] = r.id_cat_respuesta
  }

  const preguntas: PreguntaReal[] = (preguntasRaw as PreguntaReal[]) ?? []
  const totalPreguntas = preguntas.length || 12
  const respondidas    = Object.keys(respuestas_guardadas).length
  const progreso       = Math.round((respondidas / totalPreguntas) * 100)

  const cuestionario: CuestionarioData = {
    id_area,
    nombre_area:         areaData?.nombre_area ?? 'Área',
    id_mae_proyecto,
    id_mae_empresa,
    preguntas,
    estado:              estadoRow?.estado ?? (respondidas > 0 ? 'en_progreso' : 'pendiente'),
    progreso,
    respuestas_guardadas,
  }

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex antialiased">
      <EncargadoSidebar user={appUser} areas={[]} />
      <div className="flex-1 flex flex-col md:ml-64">
        <FormularioWizardReal cuestionario={cuestionario} user={appUser} />
      </div>
    </div>
  )
}
