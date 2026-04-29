import { FileText, Grid3X3, Gauge } from 'lucide-react'

const METRICS = [
  {
    label: 'Mis Plantillas de Proyecto',
    value: '4',
    badge: '+1 este mes',
    badgeColor: 'text-secondary',
    icon: FileText,
    accent: 'bg-gradient-to-r from-primary to-primary-container',
  },
  {
    label: 'Plantillas de Área',
    value: '9',
    badge: 'En curso',
    badgeColor: 'text-on-surface-variant',
    icon: Grid3X3,
    accent: 'bg-gradient-to-r from-primary to-primary-container',
  },
  {
    label: 'Scoring del Proyecto',
    value: '7.2',
    badge: 'Medio',
    badgeColor: 'text-secondary font-bold uppercase tracking-wider',
    icon: Gauge,
    accent: 'bg-gradient-to-r from-secondary to-[#2AADAD]',
    progress: 72,
  },
]

export function POMetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {METRICS.map(({ label, value, badge, badgeColor, icon: Icon, accent, progress }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-lg bg-surface-container-lowest p-6 shadow-ambient border border-outline-variant/15 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${accent}`} />
          <div className="flex items-center justify-between">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">{label}</p>
            <Icon size={18} className="text-outline" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-primary text-[3.5rem] font-bold leading-none tracking-tight">{value}</p>
            <p className={`${badgeColor} font-medium text-sm mb-2`}>{badge}</p>
          </div>
          {progress !== undefined && (
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-secondary to-[#2AADAD]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
