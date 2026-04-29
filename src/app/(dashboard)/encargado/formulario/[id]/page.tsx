import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EncargadoSidebar } from '@/components/dashboard/encargado/EncargadoSidebar'
import { FormularioWizard } from '@/components/dashboard/encargado/FormularioWizard'
import { FORMULARIOS_MOCK } from '@/lib/formularios-data'
import type { AppUser } from '@/types/user'

export default async function FormularioPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'encargado_area') redirect('/login')

  const formulario = FORMULARIOS_MOCK.find(f => f.id === params.id)
  if (!formulario) redirect('/encargado')

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex antialiased">
      <EncargadoSidebar user={appUser} />
      <div className="flex-1 flex flex-col md:ml-64">
        <FormularioWizard formulario={formulario} user={appUser} />
      </div>
    </div>
  )
}
