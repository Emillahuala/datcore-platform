import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EjecutivoSidebar } from '@/components/dashboard/ejecutivo/EjecutivoSidebar'
import { EjecutivoContent } from '@/components/dashboard/ejecutivo/EjecutivoContent'
import type { AppUser } from '@/types/user'

export default async function EjecutivoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'ejecutivo') redirect('/login')

  const appUser: AppUser = {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AppUser['user_metadata'],
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex antialiased">
      <EjecutivoSidebar user={appUser} />
      <EjecutivoContent user={appUser} />
    </div>
  )
}
