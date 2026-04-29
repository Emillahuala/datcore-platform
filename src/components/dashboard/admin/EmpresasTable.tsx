'use client'

import { useState } from 'react'
import { Search, Download } from 'lucide-react'

type Estado = 'Óptimo' | 'Medio' | 'Crítico' | 'Sin evaluar'

interface Empresa {
  id:       string
  initials: string
  nombre:   string
  proyecto: string
  po:       string
  progreso: number
  scoring:  string
  estado:   Estado
}

const DEMO: Empresa[] = [
  { id:'1', initials:'CA', nombre:'Constructora Aysén',      proyecto:'Auditoría Infraestructura V.',       po:'M. González', progreso:100, scoring:'6.5', estado:'Medio'       },
  { id:'2', initials:'CM', nombre:'Clínica Maipú',           proyecto:'Cumplimiento Fichas Clínicas',       po:'Dra. S. Rojas',progreso:30,  scoring:'3.2', estado:'Crítico'     },
  { id:'3', initials:'FV', nombre:'Fintech Valpo',           proyecto:'Onboarding Digital',                 po:'C. Pérez',    progreso:85,  scoring:'8.9', estado:'Óptimo'      },
  { id:'4', initials:'RM', nombre:'Retail Metropolitana',    proyecto:'Gestión Proveedores',                po:'A. Silva',    progreso:60,  scoring:'5.8', estado:'Medio'       },
  { id:'5', initials:'LM', nombre:'Logística Maule',         proyecto:'Seguridad Flota D.',                 po:'P. Soto',     progreso:10,  scoring:'-',   estado:'Sin evaluar' },
  { id:'6', initials:'AA', nombre:'Agroexportadora Atacama', proyecto:'Protección IP Semillas',             po:'E. Flores',   progreso:100, scoring:'9.2', estado:'Óptimo'      },
]

const ESTADO_STYLES: Record<Estado, { badge: string; dot: string }> = {
  'Óptimo':      { badge: 'bg-secondary-fixed text-on-secondary-fixed-variant',      dot: 'bg-secondary' },
  'Medio':       { badge: 'bg-surface-container-high text-surface-tint',              dot: 'bg-surface-tint' },
  'Crítico':     { badge: 'bg-error-container text-tertiary-container',               dot: 'bg-tertiary-container' },
  'Sin evaluar': { badge: 'bg-surface-variant text-outline',                          dot: 'bg-outline' },
}

const PROGRESS_COLOR: Record<Estado, string> = {
  'Óptimo':      'bg-secondary',
  'Medio':       'bg-surface-tint',
  'Crítico':     'bg-tertiary-container',
  'Sin evaluar': 'bg-outline',
}

const FILTERS: (Estado | 'Todos')[] = ['Todos', 'Óptimo', 'Medio', 'Crítico', 'Sin evaluar']

export function EmpresasTable() {
  const [filtro, setFiltro]   = useState<Estado | 'Todos'>('Todos')
  const [search, setSearch]   = useState('')

  const filtered = DEMO.filter(e => {
    const matchFiltro = filtro === 'Todos' || e.estado === filtro
    const matchSearch = e.nombre.toLowerCase().includes(search.toLowerCase()) || e.proyecto.toLowerCase().includes(search.toLowerCase())
    return matchFiltro && matchSearch
  })

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary tracking-tight">Estado de formularios por empresa</h2>
        <button className="bg-surface-container-lowest text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-ambient-sm">
          <Download size={16} /> Exportar
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-lg shadow-ambient-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 bg-surface-container-low/50 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-surface-variant/30">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors ${
                  filtro === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
            <input
              className="w-full bg-surface-container-lowest border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 pl-10 pr-4 transition-colors"
              placeholder="Buscar empresa o proyecto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest text-outline text-xs uppercase tracking-widest font-bold">
                {['Empresa', 'Proyecto / Área', 'PO (Dueño)', 'Avance', 'Scoring', 'Acción'].map(h => (
                  <th key={h} className={`p-4 font-bold ${h === 'Acción' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-surface-variant/30 hover:bg-surface-container-low/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                        {e.initials}
                      </div>
                      <span className="font-bold text-on-surface">{e.nombre}</span>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">{e.proyecto}</td>
                  <td className="p-4 text-on-surface-variant">{e.po}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full ${PROGRESS_COLOR[e.estado]} rounded-full`} style={{ width: `${e.progreso}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${e.estado === 'Crítico' ? 'text-tertiary-container' : e.estado === 'Óptimo' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                        {e.progreso}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${ESTADO_STYLES[e.estado].badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_STYLES[e.estado].dot}`} />
                      {e.estado} {e.scoring !== '-' ? `(${e.scoring})` : ''}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm hover:underline">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant py-8">Sin resultados</p>
          )}
        </div>
      </div>
    </section>
  )
}
