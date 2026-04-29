'use client'

import { Loader2 } from 'lucide-react'

type Variant = 'primario' | 'secundario' | 'outline' | 'peligro'

const variantClasses: Record<Variant, string> = {
  primario:   'bg-brand-navy text-white hover:bg-brand-navy/90',
  secundario: 'bg-brand-teal text-white hover:bg-brand-teal/90',
  outline:    'border border-brand-navy text-brand-navy hover:bg-brand-navy/5',
  peligro:    'bg-brand-red text-white hover:bg-brand-red/90',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primario',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        'flex items-center justify-center gap-2',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
