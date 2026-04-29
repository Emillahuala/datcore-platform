import { CheckSquare, BookOpen, ExternalLink } from 'lucide-react'

const TAREAS = [
  'Completar inventario de datos personales',
  'Revisar política de retención de datos',
  'Confirmar medidas de seguridad del área',
]

const RECURSOS = [
  { label: 'Guía de cumplimiento Ley 21.719', href: '#' },
  { label: 'Plantilla de inventario de datos', href: '#' },
  { label: 'FAQ sobre protección de datos',    href: '#' },
]

export function PanelAyuda() {
  return (
    <div className="flex flex-col gap-6">
      {/* Tareas pendientes */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare size={16} className="text-brand-navy" />
          <h3 className="text-sm font-semibold text-neutral-700">Tareas pendientes</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {TAREAS.map(t => (
            <li key={t} className="flex items-start gap-2 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 bg-brand-teal rounded-full mt-1.5 shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Recursos */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-brand-navy" />
          <h3 className="text-sm font-semibold text-neutral-700">Recursos de ayuda</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {RECURSOS.map(r => (
            <li key={r.label}>
              <a
                href={r.href}
                className="flex items-center gap-1.5 text-xs text-brand-teal hover:underline"
              >
                <ExternalLink size={12} />
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
