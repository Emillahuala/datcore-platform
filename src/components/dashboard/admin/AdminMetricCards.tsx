import { Building2, FileText, BarChart3, ShieldAlert } from 'lucide-react'

const METRICS = [
  { label: 'Empresas Activas',  value: '24', badge: '+3 este mes',    icon: Building2,   accent: 'bg-secondary',          iconColor: 'text-secondary'          },
  { label: 'Formularios',       value: '187', badge: '+12% vs ant.',   icon: FileText,    accent: 'bg-secondary',          iconColor: 'text-secondary'          },
  { label: 'Promedio Scoring',  value: '6.8', badge: 'Medio',         icon: BarChart3,   accent: 'bg-surface-tint',       iconColor: 'text-surface-tint'       },
  { label: 'En Riesgo Alto',    value: '5',   badge: '+2 detectadas',  icon: ShieldAlert, accent: 'bg-tertiary-container', iconColor: 'text-tertiary-container', urgent: true },
]

export function AdminMetricCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {METRICS.map(({ label, value, badge, icon: Icon, accent, iconColor, urgent }) => (
        <div key={label} className="bg-surface-container-lowest p-6 rounded-lg relative overflow-hidden group shadow-ambient-sm">
          <div className={`absolute top-0 left-0 w-full h-1 ${accent} ${urgent ? 'opacity-80' : 'opacity-50 group-hover:opacity-100 transition-opacity'}`} />
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs font-bold uppercase tracking-widest ${urgent ? 'text-tertiary-container' : 'text-outline'}`}>
              {label}
            </span>
            <Icon size={20} className={`${iconColor} opacity-70`} />
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-4xl font-bold tracking-tighter ${urgent ? 'text-tertiary-container' : 'text-primary'}`}>
              {value}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
              urgent
                ? 'text-tertiary-container bg-error-container'
                : 'text-secondary bg-secondary-fixed-dim/20'
            }`}>
              {badge}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}
