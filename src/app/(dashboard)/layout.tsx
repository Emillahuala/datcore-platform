import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  /*
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  */
  
  // Dummy user for testing UI
  const user = {
    id: '1',
    user_metadata: {
      role: 'saas_admin'
    }
  }
  
  return <>{children}</>
}
