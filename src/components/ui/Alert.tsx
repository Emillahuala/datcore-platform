import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const config: Record<AlertVariant, { icon: React.ElementType; classes: string }> = {
  info:    { icon: Info,          classes: 'bg-brand-teal/5 border-brand-teal/20 text-brand-teal' },
  success: { icon: CheckCircle,   classes: 'bg-green-50 border-green-200 text-green-700' },
  warning: { icon: AlertTriangle, classes: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  error:   { icon: XCircle,       classes: 'bg-brand-red/5 border-brand-red/20 text-brand-red' },
}

interface AlertProps {
  variant?: AlertVariant
  children: React.ReactNode
}

export function Alert({ variant = 'info', children }: AlertProps) {
  const { icon: Icon, classes } = config[variant]
  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${classes}`}>
      <Icon size={20} className="shrink-0 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  )
}
