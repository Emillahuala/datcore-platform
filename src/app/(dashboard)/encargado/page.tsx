import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EncargadoSidebar } from '@/components/dashboard/encargado/EncargadoSidebar'
import { EncargadoContent } from '@/components/dashboard/encargado/EncargadoContent'
import type { AppUser } from '@/types/user'

export default async function EncargadoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'encargado_area') redirect('/login')

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex antialiased">
      <EncargadoSidebar user={appUser} />
      <EncargadoContent user={appUser} />
    </div>
  )
}
