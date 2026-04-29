'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AppUser } from '@/types/user'

export function useUser() {
  const [user, setUser] = useState<AppUser | null>({
    id: '1',
    email: 'admin@saas.com',
    user_metadata: { role: 'saas_admin' } as any
  })
  const [loading, setLoading] = useState(false)

  /* Comentado para bypass
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          user_metadata: data.user.user_metadata as AppUser['user_metadata'],
        })
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          user_metadata: session.user.user_metadata as AppUser['user_metadata'],
        })
      } else {
        setUser(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])
  */

  return { user, loading }
}
