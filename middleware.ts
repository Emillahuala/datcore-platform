import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_DEFAULT_ROUTES } from '@/types/roles'
import type { Role } from '@/types/roles'

const PROTECTED_ROUTES: Record<string, Role> = {
  '/admin':         'admin',
  '/product-owner': 'product_owner',
  '/encargado':     'encargado_area',
  '/ejecutivo':     'ejecutivo',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Usuario autenticado en /login → redirigir a su panel
  if (pathname === '/login' && user) {
    const role = user.user_metadata?.role as Role | undefined
    const destination = role ? ROLE_DEFAULT_ROUTES[role] : '/login'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Verificar acceso a rutas protegidas
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (matchedRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const userRole = user.user_metadata?.role as Role | undefined
    const requiredRole = PROTECTED_ROUTES[matchedRoute]

    if (userRole !== requiredRole) {
      const fallback = userRole ? ROLE_DEFAULT_ROUTES[userRole] : '/login'
      return NextResponse.redirect(new URL(fallback, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
