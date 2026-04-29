import { Building2, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface Metric {
  label:    string
  value:    string | number
  icon:     React.ElementType
  iconColor: string
}

const METRICS: Metric[] = [
  { label: 'Total Empresas',              value: '—', icon: Building2,    iconColor: 'text-brand-navy' },
  { label: 'Cuestionarios completados',   value: '—', icon: CheckCircle2, iconColor: 'text-green-600' },
  { label: 'Cuestionarios pendientes',    value: '—', icon: Clock,        iconColor: 'text-brand-teal' },
  { label: 'Cumplimiento promedio',       value: '—', icon: TrendingUp,   iconColor: 'text-brand-navy' },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {METRICS.map(({ label, value, icon: Icon, iconColor }) => (
        <Card key={label} className="flex items-center gap-4">
          <div className={`${iconColor} shrink-0`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
