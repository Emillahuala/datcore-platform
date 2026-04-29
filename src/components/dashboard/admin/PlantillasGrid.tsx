import { Users, Megaphone, Wrench, ArrowUpRight } from 'lucide-react'

const PLANTILLAS = [
  { id:'1', icon: Users,    iconBg: 'bg-primary-container text-on-primary-container', titulo: 'Seguridad RRHH y Contratos',        desc: 'Evaluación estándar para el manejo de datos de empleados y confidencialidad en contrataciones.', tag: 'Plantilla de área',    tagStyle: 'bg-surface-container-highest text-on-surface-variant', empresas: 12 },
  { id:'2', icon: Megaphone,iconBg: 'bg-primary-container text-on-primary-container', titulo: 'Marketing y Bases de Datos',          desc: 'Cuestionario enfocado en la recolección, almacenamiento y uso de datos de clientes.',             tag: 'Plantilla de área',    tagStyle: 'bg-surface-container-highest text-on-surface-variant', empresas: 8  },
  { id:'3', icon: Wrench,   iconBg: 'bg-secondary-fixed text-on-secondary-fixed',     titulo: 'Auditoría Infraestructura Cloud',     desc: 'Evaluación técnica profunda para migraciones a la nube y gestión de proveedores IaaS/PaaS.',      tag: 'Plantilla de proyecto', tagStyle: 'bg-secondary/10 text-secondary',                        empresas: 4  },
]

export function PlantillasGrid() {
  return (
    <section className="flex flex-col gap-6 pt-8">
      <div className="flex items-center justify-between border-b border-surface-variant/50 pb-4">
        <h2 className="text-2xl font-bold text-primary tracking-tight">Plantillas de cuestionarios activas</h2>
        <a href="#" className="text-secondary font-medium text-sm hover:underline flex items-center gap-1">
          Ver todas <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANTILLAS.map(({ id, icon: Icon, iconBg, titulo, desc, tag, tagStyle, empresas }) => (
          <div
            key={id}
            className="bg-surface-container-low hover:bg-surface-container p-6 rounded-lg transition-colors cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`${iconBg} p-3 rounded-md shadow-ambient-sm`}>
                <Icon size={20} />
              </div>
              <span className={`${tagStyle} text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded-sm`}>
                {tag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">{titulo}</h3>
            <p className="text-sm text-on-surface-variant mb-6 flex-1 line-clamp-2">{desc}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant/50">
              <span className="text-xs text-outline font-medium">
                Usada en {empresas} empresa{empresas !== 1 ? 's' : ''}
              </span>
              <ArrowUpRight size={18} className="text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
