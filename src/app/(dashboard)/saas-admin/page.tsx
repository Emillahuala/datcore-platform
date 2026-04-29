import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SaasAdminContent } from '@/components/dashboard/saas-admin/SaasAdminContent'

export default async function SaasAdminPage() {
  /*
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'saas_admin') {
    redirect('/login')
  }
  */

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col gap-2 relative z-10 animate-fade-up">
        <h1 className="text-3xl tracking-tight font-bold text-gray-900">Dashboard SaaS</h1>
        <p className="text-m text-gray-600 font-medium">Gestión integral de empresas consultoras y facturación.</p>
      </header>

      <SaasAdminContent />
    </div>
  )
}
