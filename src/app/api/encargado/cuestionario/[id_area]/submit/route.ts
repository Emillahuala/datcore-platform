import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  respuestas: z.array(z.object({
    id_cat_pregunta: z.number().int().positive(),
    id_cat_respuesta: z.number().int().positive(),
  })),
  declaracion_veracidad: z.boolean().default(false),
  borrador: z.boolean().default(false),
  archivo: z.object({
    nombre:     z.string(),
    url:        z.string(),
    size_bytes: z.number().optional(),
    mime_type:  z.string().optional(),
  }).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_area: string }> }
) {
  try {
    const { id_area: id_area_str } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'encargado_area') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const id_area = parseInt(id_area_str)
    if (isNaN(id_area)) {
      return NextResponse.json({ error: 'Área inválida' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', detalles: parsed.error.flatten() }, { status: 400 })
    }

    const { respuestas, declaracion_veracidad, borrador, archivo } = parsed.data

    // Validar declaración solo en envío final
    if (!borrador && !declaracion_veracidad) {
      return NextResponse.json({ error: 'Debes aceptar la declaración de veracidad' }, { status: 400 })
    }

    const admin = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = admin as any

    // Verificar que el encargado tiene acceso a esta área
    const { data: rol } = await db
      .from('movusuariorol')
      .select('id_mae_proyecto, id_mae_empresa')
      .eq('id_mae_usuario', user.id)
      .eq('id_rol', 3)
      .eq('id_area', id_area)
      .eq('activo', true)
      .maybeSingle()

    if (!rol) {
      return NextResponse.json({ error: 'Sin acceso a esta área' }, { status: 403 })
    }

    const { id_mae_proyecto, id_mae_empresa } = rol

    // 1. Guardar cada respuesta vía SP (upsert interno)
    for (const r of respuestas) {
      await db.rpc('sp_guarda_respuesta_web', {
        p_id_mae_usuario:   user.id,
        p_id_mae_empresa:   id_mae_empresa,
        p_id_mae_proyecto:  id_mae_proyecto,
        p_id_cat_pregunta:  r.id_cat_pregunta,
        p_id_cat_respuesta: r.id_cat_respuesta,
        p_id_area:          id_area,
      })
    }

    // 2. Upsert estado del cuestionario
    const estadoNuevo = borrador ? 'en_progreso' : 'completado'
    await db
      .from('movcuestionarioestado')
      .upsert({
        id_mae_usuario:        user.id,
        id_mae_proyecto,
        id_mae_empresa,
        id_area,
        estado:                estadoNuevo,
        declaracion_veracidad: !borrador,
        fecha_completado:      borrador ? null : new Date().toISOString(),
        fecha_mov:             new Date().toISOString(),
      }, { onConflict: 'id_mae_usuario,id_mae_proyecto,id_area' })

    // 3. Guardar archivo adjunto si viene (solo en envío final)
    if (!borrador && archivo) {
      await db
        .from('movarchivocuestionario')
        .insert({
          id_mae_usuario: user.id,
          id_mae_proyecto,
          id_mae_empresa,
          id_area,
          nombre_archivo: archivo.nombre,
          url_archivo:    archivo.url,
          size_bytes:     archivo.size_bytes ?? null,
          mime_type:      archivo.mime_type ?? null,
        })
    }

    // 4. Notificaciones solo en envío final
    if (!borrador) {
      const [{ data: areaData }, { data: usuarioData }, { data: proyectoData }] = await Promise.all([
        db.from('catareas').select('nombre_area').eq('id_area', id_area).single(),
        db.from('maeusuario').select('nombre_usuario').eq('id_mae_usuario', user.id).single(),
        db.from('maeproyecto').select('nombre_proyecto, id_mae_usuario_po').eq('id_mae_proyecto', id_mae_proyecto).single(),
      ])

      const nombreArea      = areaData?.nombre_area      ?? 'Área'
      const nombreEncargado = usuarioData?.nombre_usuario ?? 'Encargado'
      const nombreProyecto  = proyectoData?.nombre_proyecto ?? 'Proyecto'
      const idPO            = proyectoData?.id_mae_usuario_po

      // Notificar al PO
      if (idPO) {
        await db.from('movnotificacion').insert({
          id_mae_usuario:  idPO,
          id_mae_proyecto,
          id_mae_empresa,
          tipo:            'cuestionario_completado',
          titulo:          `Cuestionario completado — ${nombreArea}`,
          mensaje:         `${nombreEncargado} completó el diagnóstico del área ${nombreArea} en "${nombreProyecto}".`,
          link_destino:    '/product-owner',
        })
      }

      // Notificar a todos los admins y admin_saas
      const { data: allUsers } = await admin.auth.admin.listUsers({ perPage: 200 })
      const adminUsers = (allUsers?.users ?? []).filter(
        u => u.user_metadata?.role === 'admin' || u.user_metadata?.role === 'admin_saas'
      )

      for (const adminUser of adminUsers) {
        await db.from('movnotificacion').insert({
          id_mae_usuario:  adminUser.id,
          id_mae_proyecto,
          id_mae_empresa,
          tipo:            'cuestionario_completado',
          titulo:          `Cuestionario completado — ${nombreArea}`,
          mensaje:         `${nombreEncargado} completó el diagnóstico del área ${nombreArea} (proyecto "${nombreProyecto}").`,
          link_destino:    '/admin',
        })
      }
    }

    return NextResponse.json({ ok: true, estado: estadoNuevo })

  } catch (err) {
    console.error('[cuestionario/submit]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
