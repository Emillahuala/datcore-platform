'use client'

import { useState } from 'react'
import { Plus, Send, ArrowRight } from 'lucide-react'

// --- Plantillas de proyecto (PO) ---
const PO_TEMPLATES = [
  {
    id: '1',
    titulo: 'Cuestionario Inicial Riesgos Legales',
    updated: '12 Oct 2023',
    status: 'Borrador',
    statusStyle: 'bg-surface-container-high text-on-surface-variant',
    accent: false,
    preguntas: [
      '¿Cuenta con políticas actualizadas de prevención de delitos (Ley 20.393)?',
      '¿Existen contratos de confidencialidad firmados por el directorio?',
    ],
    extra: '+ 1 pregunta más...',
    actions: ['Editar', 'Enviar a áreas'],
  },
  {
    id: '2',
    titulo: 'Evaluación Seguridad de la Información',
    updated: '10 Oct 2023',
    status: 'Activo',
    statusStyle: 'bg-secondary/10 text-secondary',
    accent: true,
    progress: 45,
    total: '5/11',
    actions: ['Ver resultados'],
  },
]

// --- Plantillas de área ---
const AREA_TEMPLATES = [
  {
    id: 'rrhh',
    area: 'Recursos Humanos',
    count: 3,
    status: 'ok',
    items: [
      { titulo: 'Anexo Contratos RRHH',      encargado: 'M. Silva', pct: '100%',    pctStyle: 'bg-secondary/10 text-secondary' },
      { titulo: 'Políticas Inclusión 2023',   encargado: 'J. Pérez', pct: 'Pendiente', pctStyle: 'bg-surface-container-highest text-on-surface-variant' },
    ],
  },
  {
    id: 'ti',
    area: 'Tecnología (TI)',
    count: 4,
    status: 'urgent',
    items: [
      { titulo: 'Auditoría Servidores AWS',  encargado: 'R. Soto — Atrasado', pct: '0%',  pctStyle: 'bg-tertiary-container/10 text-tertiary-container' },
      { titulo: 'Control Accesos VPN',        encargado: 'L. Gómez',          pct: '50%', pctStyle: 'bg-secondary/10 text-secondary' },
    ],
  },
  {
    id: 'legal',
    area: 'Legal',
    count: 2,
    status: 'ok',
    items: [
      { titulo: 'Revisión Contratos Marco',   encargado: 'C. Ruiz',  pct: '100%', pctStyle: 'bg-secondary/10 text-secondary' },
    ],
  },
]

const AREA_FILTERS = ['Todas las áreas', 'Recursos Humanos (3)', 'Tecnología (4)', 'Legal (2)']

export function POPlantillas() {
  const [activeFilter, setActiveFilter] = useState('Todas las áreas')

  return (
    <div className="flex flex-col gap-16">
      {/* Mis plantillas de cuestionario */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-primary text-[2rem] font-bold leading-tight">
            Mis plantillas de cuestionario de proyecto
          </h2>
          <button className="flex items-center gap-2 rounded-md h-10 px-6 bg-gradient-secondary text-on-secondary text-sm font-bold shadow-ambient hover:brightness-110 transition-all">
            <Plus size={16} /> Nueva plantilla
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PO_TEMPLATES.map(t => (
            <div
              key={t.id}
              className={`bg-surface-container-lowest rounded-lg p-6 shadow-ambient border border-outline-variant/15 flex flex-col gap-6 relative overflow-hidden`}
            >
              {t.accent && <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-primary text-lg font-bold mb-1">{t.titulo}</h3>
                  <p className="text-on-surface-variant text-sm">
                    {t.status === 'Activo' ? `Enviado: ${t.updated}` : `Última edición: ${t.updated}`}
                  </p>
                </div>
                <span className={`${t.statusStyle} text-xs font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                  {t.status}
                </span>
              </div>

              {t.preguntas && (
                <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/15">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                    Vista Previa ({t.preguntas.length} Preguntas)
                  </p>
                  <ul className="flex flex-col gap-2">
                    {t.preguntas.map(q => (
                      <li key={q} className="flex items-start gap-2 text-sm text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                    {t.extra && (
                      <li className="text-sm text-secondary font-medium pl-4 pt-1 cursor-pointer hover:underline">
                        {t.extra}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {t.progress !== undefined && (
                <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/15">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                    Progreso Global
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${t.progress}%` }} />
                      </div>
                      <p className="text-xs text-on-surface-variant mt-2">{t.progress}% Completado por las áreas</p>
                    </div>
                    <p className="text-primary font-bold text-xl">{t.total}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-auto">
                {t.actions.map(a => (
                  <button
                    key={a}
                    className={
                      a === 'Enviar a áreas'
                        ? 'bg-primary-container text-on-primary font-bold text-sm px-4 py-2 rounded-md shadow-ambient-sm hover:bg-primary transition-colors flex items-center gap-2'
                        : 'text-primary font-bold text-sm px-4 py-2 hover:bg-surface-container-high rounded transition-colors'
                    }
                  >
                    {a === 'Enviar a áreas' && <Send size={14} />}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plantillas por área */}
      <section>
        <h2 className="text-primary text-[2rem] font-bold leading-tight mb-6">Plantillas por área</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 bg-surface-container-low p-2 rounded-lg border border-outline-variant/15">
          {AREA_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                activeFilter === f
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-ambient-sm border border-outline-variant/15'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Area cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {AREA_TEMPLATES.map(a => (
            <div
              key={a.id}
              className="bg-surface-container-lowest rounded-lg p-6 shadow-ambient border border-outline-variant/15 flex flex-col relative overflow-hidden"
            >
              {a.status === 'urgent' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-tertiary-container" />
              )}
              <div className={`flex items-center gap-3 mb-4 pb-4 border-b border-surface-variant`}>
                <div className={`size-10 rounded-md flex items-center justify-center ${a.status === 'urgent' ? 'bg-tertiary-container/10 text-tertiary-container' : 'bg-primary-container/10 text-primary-container'}`}>
                  <span className="text-sm font-bold">{a.area.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-primary font-bold text-base">{a.area}</h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">{a.count} Plantillas</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {a.items.map(item => (
                  <div key={item.titulo} className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-on-surface line-clamp-1">{item.titulo}</p>
                      <p className={`text-xs ${a.status === 'urgent' && item.pct === '0%' ? 'text-tertiary-container font-medium' : 'text-on-surface-variant'}`}>
                        Encargado: {item.encargado}
                      </p>
                    </div>
                    <span className={`${item.pctStyle} text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ml-2`}>
                      {item.pct}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full py-2 text-center text-sm font-bold text-secondary border border-secondary/30 rounded-md hover:bg-secondary/5 transition-colors mt-auto flex items-center justify-center gap-1">
                Ver detalle área <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
