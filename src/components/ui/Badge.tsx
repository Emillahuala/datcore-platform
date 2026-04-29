import type { Role } from '@/types/roles'

type BadgeVariant = Role | 'success' | 'warning' | 'danger' | 'neutral'

const variantClasses: Record<BadgeVariant, string> = {
  admin:          'bg-brand-navy/10 text-brand-navy',
  product_owner:  'bg-brand-teal/10 text-brand-teal',
  encargado_area: 'bg-neutral-100 text-neutral-600',
  ejecutivo:      'bg-brand-dark/10 text-brand-dark',
  saas_admin:     'bg-purple-100 text-purple-800',
  success:        'bg-green-100 text-green-700',
  warning:        'bg-brand-teal/10 text-brand-teal',
  danger:         'bg-brand-red/10 text-brand-red',
  neutral:        'bg-neutral-100 text-neutral-600',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
