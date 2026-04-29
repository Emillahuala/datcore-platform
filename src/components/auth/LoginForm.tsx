'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { ROLE_DEFAULT_ROUTES } from '@/types/roles'
import type { Role } from '@/types/roles'
import Link from 'next/link'

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormErrors = Partial<Record<'email' | 'password' | 'general', string>>

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<FormErrors>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof FormErrors
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      setErrors({ general: 'Correo o contraseña incorrectos' })
      setLoading(false)
      return
    }

    const role = data.user.user_metadata?.role as Role | undefined
    router.push(role ? ROLE_DEFAULT_ROUTES[role] : '/login')
  }

  const dm = { fontFamily: '"DM Sans", sans-serif' }
  const inputBase = 'block w-full pl-10 pr-3 py-3 bg-white border-0 border-b-2 text-on-background placeholder-outline/40 focus:ring-0 transition-all text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={dm}>

      {/* Heading */}
      <div className="animate-fade-up mb-8">
        <h1 className="text-[2rem] font-semibold text-primary mb-1.5 tracking-tight leading-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-on-surface-variant text-sm font-normal">
          Ingresa tus credenciales para acceder al panel.
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
            className={`${inputBase} ${errors.email ? 'border-error' : 'border-outline-variant/25 focus:border-secondary'}`}
            style={dm}
          />
        </div>
        {errors.email && <p className="text-xs text-error mt-1.5">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="animate-fade-up delay-150">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-on-surface-variant" htmlFor="password">
            Contraseña
          </label>
          <Link href="/recuperar-password" className="text-xs text-secondary hover:text-primary transition-colors font-medium">
            ¿Olvidó su contraseña?
          </Link>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-outline group-focus-within:text-secondary transition-colors" />
          </div>
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            className={`${inputBase} pr-10 ${errors.password ? 'border-error' : 'border-outline-variant/25 focus:border-secondary'}`}
            style={dm}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-secondary transition-colors"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-error mt-1.5">{errors.password}</p>}
      </div>

      {/* Remember me */}
      <div className="animate-fade-up delay-200">
        <label className="flex items-center gap-2.5 cursor-pointer w-fit group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border-outline-variant/40 text-secondary focus:ring-secondary/30 bg-white accent-secondary"
          />
          <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            Mantener sesión iniciada
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="animate-fade-up delay-250 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-secondary to-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-ambient"
          style={dm}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Ingresando...
            </>
          ) : 'Iniciar sesión'}
        </button>
      </div>

      {errors.general && (
        <p className="text-sm text-error text-center animate-fade-in">{errors.general}</p>
      )}

      {/* Divider */}
      <div className="animate-fade-up delay-300 relative flex items-center gap-4">
        <div className="flex-1 h-px bg-outline-variant/20" />
        <span className="text-xs text-outline/50">o</span>
        <div className="flex-1 h-px bg-outline-variant/20" />
      </div>

      <p className="animate-fade-up delay-350 text-sm text-on-surface-variant text-center">
        ¿No tienes cuenta?{' '}
        <a href="#" className="text-secondary hover:text-primary transition-colors font-medium">
          Contacta a tu administrador
        </a>
      </p>
    </form>
  )
}
