import { Building2, Users, FileText, DollarSign } from 'lucide-react'

const METRICS = [
  { title: 'Total Consultoras', value: '14', change: '+2 respecto mes anterior', icon: Building2 },
  { title: 'Usuarios Activos',  value: '840', change: '+12% respecto mes anterior', icon: Users },
  { title: 'Cuestionarios Creados', value: '3,200', change: 'En total histórico', icon: FileText },
  { title: 'Facturación Mensual', value: '$45k', change: '+8% respecto mes anterior', icon: DollarSign },
]

export function SaasMetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
      {METRICS.map((metric, i) => {
        const Icon = metric.icon
        return (
          <div
            key={i}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient-sm flex flex-col justify-between"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                {metric.title}
              </span>
              <Icon size={20} className="text-secondary" />
            </div>
            <div>
              <span className="text-3xl font-bold tracking-tight text-primary">
                {metric.value}
              </span>
              <p className="text-xs font-medium text-outline mt-2">{metric.change}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
