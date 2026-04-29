'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})

export function NuevaPasswordForm() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})
  const [success, setSuccess]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = schema.safeParse({ password, confirm })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(err => {
        fieldErrors[String(err.path[0])] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrors({ general: 'Error al actualizar la contraseña. Intenta nuevamente.' })
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login?mensaje=password_actualizado'), 2000)
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="text-sm text-green-600 font-medium">
          ¡Contraseña actualizada correctamente! Redirigiendo...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="new-password" className="text-sm font-medium text-neutral-700">
          Nueva contraseña
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            className={[
              'w-full border rounded-lg px-3 py-2 pr-10 text-sm',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'placeholder:text-neutral-400',
              errors.password ? 'border-brand-red focus:ring-brand-red' : 'border-neutral-300 focus:ring-brand-teal',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-brand-red">{errors.password}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirm-password" className="text-sm font-medium text-neutral-700">
          Confirmar contraseña
        </label>
        <input
          id="confirm-password"
          type={showPass ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repite tu nueva contraseña"
          autoComplete="new-password"
          className={[
            'w-full border rounded-lg px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'placeholder:text-neutral-400',
            errors.confirm ? 'border-brand-red focus:ring-brand-red' : 'border-neutral-300 focus:ring-brand-teal',
          ].join(' ')}
        />
        {errors.confirm && <p className="text-xs text-brand-red">{errors.confirm}</p>}
      </div>

      <Button type="submit" loading={loading} fullWidth>
        {loading ? 'Actualizando...' : 'Actualizar contraseña'}
      </Button>

      {errors.general && (
        <p className="text-sm text-brand-red text-center">{errors.general}</p>
      )}
    </form>
  )
}
