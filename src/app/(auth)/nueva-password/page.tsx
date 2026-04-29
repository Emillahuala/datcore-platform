import { KeyRound } from 'lucide-react'
import { NuevaPasswordForm } from '@/components/auth/NuevaPasswordForm'

export default function NuevaPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-brand-teal/10 rounded-full flex items-center justify-center">
            <KeyRound size={28} className="text-brand-teal" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Nueva contraseña</h1>
            <p className="text-sm text-neutral-500 mt-1">Elige una contraseña segura</p>
          </div>
        </div>

        <NuevaPasswordForm />
      </div>
    </div>
  )
}
