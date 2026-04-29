import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  correo:    z.string().email(),
  nombre:    z.string().min(2),
  idArea:    z.number().int().positive(),
  idProyecto: z.string().uuid(),
  idEmpresa:  z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    // Verificar sesión y rol
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'product_owner') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Validar body
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', detalles: parsed.error.flatten() }, { status: 400 })
    }

    const { correo, nombre, idArea, idProyecto, idEmpresa } = parsed.data

    // Verificar que el PO tiene acceso a ese proyecto
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: rolPO } = await db
      .from('movusuariorol')
      .select('id_mov_usuario_rol')
      .eq('id_mae_usuario', user.id)
      .eq('id_rol', 2)
      .eq('id_mae_proyecto', idProyecto)
      .eq('activo', true)
      .maybeSingle()

    if (!rolPO) {
      return NextResponse.json({ error: 'No tienes acceso a este proyecto' }, { status: 403 })
    }

    // Admin client para operaciones privilegiadas
    const admin = createAdminClient()

    // 1. Invitar al usuario vía Supabase Auth
    const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(correo, {
      data: {
        role:       'encargado_area',
        nombre,
        empresa_id: idEmpresa,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/nueva-password`,
    })

    if (inviteError) {
      // Si el usuario ya existe, obtener su UUID
      if (!inviteError.message.includes('already')) {
        return NextResponse.json({ error: `Error al invitar: ${inviteError.message}` }, { status: 500 })
      }
    }

    const uid = inviteData?.user?.id
    if (!uid) {
      return NextResponse.json({ error: 'No se pudo obtener el ID del usuario invitado' }, { status: 500 })
    }

    const fechaLimite = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

    // 2. Crear perfil en maeusuario
    await admin
      .from('maeusuario')
      .upsert({
        id_mae_usuario:         uid,
        nombre_usuario:         nombre,
        activo:                 true,
        estado_activacion:      'pendiente_activacion',
        fecha_limite_activacion: fechaLimite,
      }, { onConflict: 'id_mae_usuario' })

    // 3. Vincular a la empresa
    await admin
      .from('movusuarioempresa')
      .upsert({
        id_mae_usuario: uid,
        id_mae_empresa: idEmpresa,
        activo:         true,
      }, { onConflict: 'id_mae_usuario,id_mae_empresa' })

    // 4. Asignar rol encargado_area en el área y proyecto
    await admin
      .from('movusuariorol')
      .upsert({
        id_mae_usuario:  uid,
        id_rol:          3, // encargado_area
        id_mae_empresa:  idEmpresa,
        id_mae_proyecto: idProyecto,
        id_area:         idArea,
        activo:          true,
      }, { onConflict: 'id_mae_usuario,id_rol,id_mae_proyecto,id_area' })

    // 5. Notificar al PO vía stored procedure
    await admin.rpc('sp_invita_encargado', {
      p_nombre:          nombre,
      p_id_area:         idArea,
      p_id_mae_proyecto: idProyecto,
      p_id_mae_empresa:  idEmpresa,
    })

    // 6. Registrar envío de correo
    await admin
      .from('movenviocorreo')
      .insert({
        correo_destino:  correo,
        asunto:          'Invitación a DatCore — Activa tu cuenta',
        id_mae_usuario:  uid,
        id_mae_proyecto: idProyecto,
        estado_envio:    'Enviado',
        fecha_envio:     new Date().toISOString(),
      })

    return NextResponse.json({ ok: true, uid })

  } catch (err) {
    console.error('[invitar-encargado]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
