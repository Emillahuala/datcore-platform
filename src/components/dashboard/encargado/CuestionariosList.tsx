import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Cuestionario {
  id:          string
  titulo:      string
  descripcion: string
  estado:      'Completado' | 'En progreso' | 'Pendiente'
  progreso:    number
}

const DEMO: Cuestionario[] = [
  {
    id: '1',
    titulo: 'Inventario de datos personales',
    descripcion: 'Identifica y clasifica todos los datos personales que maneja tu área.',
    estado: 'En progreso',
    progreso: 60,
  },
  {
    id: '2',
    titulo: 'Evaluación de riesgos',
    descripcion: 'Evalúa los riesgos de privacidad asociados a tus procesos.',
    estado: 'Pendiente',
    progreso: 0,
  },
  {
    id: '3',
    titulo: 'Política de retención de datos',
    descripcion: 'Define los plazos de retención y eliminación de datos en tu área.',
    estado: 'Completado',
    progreso: 100,
  },
]

const ESTADO_VARIANT = {
  Completado:    'success',
  'En progreso': 'warning',
  Pendiente:     'neutral',
} as const

export function CuestionariosList() {
  return (
    <div className="flex flex-col gap-4">
      {DEMO.map(c => (
        <div
          key={c.id}
          className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5 flex flex-col gap-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900">{c.titulo}</p>
              <p className="text-xs text-neutral-500 mt-1">{c.descripcion}</p>
            </div>
            <Badge variant={ESTADO_VARIANT[c.estado]}>{c.estado}</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-neutral-200 rounded-full h-2">
              <div
                className="bg-brand-teal h-2 rounded-full transition-all"
                style={{ width: `${c.progreso}%` }}
              />
            </div>
            <span className="text-xs text-neutral-500 w-10 text-right">{c.progreso}%</span>
          </div>

          <div className="flex justify-end">
            <Button variant={c.estado === 'Completado' ? 'outline' : 'secundario'} className="text-xs px-3 py-1.5">
              {c.estado === 'Completado' ? 'Ver' : 'Completar'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
