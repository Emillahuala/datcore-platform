'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Info } from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export function RecuperarForm() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = schema.safeParse({ email })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/nueva-password`,
    })

    if (supabaseError) {
      setError('Error al enviar el correo. Intenta nuevamente.')
      setLoading(false)
      return
    }

    router.push(`/recuperar-password/confirmacion?email=${encodeURIComponent(email)}`)
  }

  const dm = { fontFamily: '"DM Sans", sans-serif' }
  const inputBase = 'block w-full pl-10 pr-3 py-3 bg-white border-0 border-b-2 text-on-background placeholder-outline/40 focus:ring-0 transition-all text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={dm}>

      {/* Heading */}
      <div className="animate-fade-up mb-8">
        <h1 className="text-[2rem] font-semibold text-primary mb-1.5 tracking-tight leading-tight">
          Recuperar contraseña
        </h1>
        <p className="text-on-surface-variant text-sm font-normal">
          Te enviaremos un enlace a tu correo registrado.
        </p>
      </div>

      {/* Email */}
      <div className="animate-fade-up delay-100">
        <label className="block text-xs font-medium text-on-surface-variant mb-2" htmlFor="email">
          Correo electrónico
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-outline group-focus-within:text-secondary transition-colors" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="nombre@empresa.cl"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            className={`${inputBase} ${error ? 'border-error' : 'border-outline-variant/25 focus:border-secondary'}`}
            style={dm}
          />
        </div>
        {error && <p className="text-xs text-error mt-1.5">{error}</p>}
      </div>

      {/* Info note */}
      <div className="animate-fade-up delay-150 flex items-start gap-3 bg-secondary/5 border border-secondary/15 rounded-md p-3.5">
        <Info size={15} className="text-secondary shrink-0 mt-0.5" />
        <p className="text-xs text-on-surface-variant leading-relaxed" style={dm}>
          El enlace será válido por <span className="font-semibold text-on-surface">30 minutos</span>. Si no lo recibes, revisa tu carpeta de spam.
        </p>
      </div>

      {/* Submit */}
      <div className="animate-fade-up delay-200 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-secondary to-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-ambient"
          style={dm}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : 'Enviar enlace de recuperación'}
        </button>
      </div>

      {/* Back link */}
      <div className="animate-fade-up delay-250">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors group"
          style={dm}
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Volver a iniciar sesión
        </Link>
      </div>
    </form>
  )
}
