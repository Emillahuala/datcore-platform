/**
 * Script para crear usuario encargado de prueba.
 * Ejecutar: node scripts/create-test-encargado.mjs
 * Borrar:   node scripts/create-test-encargado.mjs --delete
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://azqowhriwxasynzucnuj.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cW93aHJpd3hhc3luenVjbnVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjcwNzM1NiwiZXhwIjoyMDkyMjgzMzU2fQ.Hl_bsb_j8HoA48Hjl_36TionBpTdLpDQqC5PD5edh6Y'

const ID_MAE_EMPRESA  = '0114d3d8-6a7e-4428-8b74-f9b4d4ca0487'
const ID_MAE_PROYECTO = '4cae67f5-ea62-4417-8fe0-b86d002cce40'

// Datos del usuario de prueba
const TEST_EMAIL    = 'encargado-test@datcore.local'
const TEST_PASSWORD = 'Test1234!'
const TEST_NOMBRE   = 'Ana García (Test)'
const TEST_ID_AREA  = 1  // RRHH

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── BORRAR ────────────────────────────────────────────────
async function deleteTestUser() {
  console.log('🗑  Borrando usuario de prueba...')

  // Buscar por email
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 200 })
  const testUser = users.find(u => u.email === TEST_EMAIL)

  if (!testUser) {
    console.log('⚠  Usuario no encontrado en auth. Nada que borrar.')
    return
  }

  const uid = testUser.id
  console.log(`   UID: ${uid}`)

  // Borrar registros relacionados (cascada manual)
  await admin.from('movarchivocuestionario').delete().eq('id_mae_usuario', uid)
  await admin.from('movcuestionarioestado').delete().eq('id_mae_usuario', uid)
  await admin.from('movrespuestacuestionario').delete().eq('id_mae_usuario', uid)
  await admin.from('movnotificacion').delete().eq('id_mae_usuario', uid)
  await admin.from('movusuariorol').delete().eq('id_mae_usuario', uid)
  await admin.from('movusuarioempresa').delete().eq('id_mae_usuario', uid)
  await admin.from('maeusuario').delete().eq('id_mae_usuario', uid)

  // Borrar de auth
  const { error } = await admin.auth.admin.deleteUser(uid)
  if (error) {
    console.error('❌ Error borrando auth user:', error.message)
  } else {
    console.log('✅ Usuario de prueba eliminado completamente.')
  }
}

// ─── CREAR ─────────────────────────────────────────────────
async function createTestUser() {
  console.log('🚀 Creando usuario encargado de prueba...')

  // 1. Crear en auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email:            TEST_EMAIL,
    password:         TEST_PASSWORD,
    email_confirm:    true,
    user_metadata: {
      role:       'encargado_area',
      nombre:     TEST_NOMBRE,
      empresa_id: ID_MAE_EMPRESA,
    },
  })

  if (authError) {
    console.error('❌ Error creando auth user:', authError.message)
    process.exit(1)
  }

  const uid = authData.user.id
  console.log(`   UID creado: ${uid}`)

  // 2. Perfil en maeusuario
  const { error: e2 } = await admin.from('maeusuario').insert({
    id_mae_usuario:          uid,
    nombre_usuario:          TEST_NOMBRE,
    activo:                  true,
    estado_activacion:       'activo',
    fecha_limite_activacion: null,
  })
  if (e2) console.error('  ⚠ maeusuario:', e2.message)
  else    console.log('   ✓ maeusuario insertado')

  // 3. Vincular a empresa
  const { error: e3 } = await admin.from('movusuarioempresa').insert({
    id_mae_usuario: uid,
    id_mae_empresa: ID_MAE_EMPRESA,
    activo:         true,
  })
  if (e3) console.error('  ⚠ movusuarioempresa:', e3.message)
  else    console.log('   ✓ movusuarioempresa insertado')

  // 4. Asignar rol encargado_area (id_rol=3) en área RRHH (id_area=1)
  const { error: e4 } = await admin.from('movusuariorol').insert({
    id_mae_usuario:  uid,
    id_rol:          3,
    id_mae_empresa:  ID_MAE_EMPRESA,
    id_mae_proyecto: ID_MAE_PROYECTO,
    id_area:         TEST_ID_AREA,
    activo:          true,
  })
  if (e4) console.error('  ⚠ movusuariorol:', e4.message)
  else    console.log('   ✓ movusuariorol insertado (RRHH)')

  console.log('\n✅ Usuario de prueba listo:')
  console.log(`   Email:    ${TEST_EMAIL}`)
  console.log(`   Password: ${TEST_PASSWORD}`)
  console.log(`   Área:     RRHH (id=1)`)
  console.log(`   UID:      ${uid}`)
  console.log('\n💡 Para borrar: node scripts/create-test-encargado.mjs --delete')
}

// ─── MAIN ──────────────────────────────────────────────────
const deleteMode = process.argv.includes('--delete')
if (deleteMode) {
  deleteTestUser().catch(console.error)
} else {
  createTestUser().catch(console.error)
}
