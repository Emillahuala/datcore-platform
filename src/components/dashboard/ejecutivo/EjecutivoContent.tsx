'use client'

import { useState } from 'react'
import {
  FolderKanban, ChevronDown, Pencil, X, Check,
  Building2, Calendar, User, Search,
} from 'lucide-react'
import { ESTADOS_PROYECTO, type EstadoProyecto } from '@/types/roles'
import type { AppUser } from '@/types/user'

interface Proyecto {
  id:          string
  nombre:      string
  empresa:     string
  sector:      string
  po:          string
  estado:      EstadoProyecto
  progreso:    number
  inicio:      string
  descripcion: string
}

const PROYECTOS_MOCK: Proyecto[] = [
  {
    id:          '1',
    nombre:      'Auditoría Infraestructura V.',
    empresa:     'Constructora Aysén',
    sector:      'Construcción',
    po:          'M. González',
    estado:      'En remediación',
    progreso:    65,
    inicio:      '2026-01-15',
    descripcion: 'Evaluación y remediación de brechas en infraestructura de datos conforme a Ley 21.719.',
  },
  {
    id:          '2',
    nombre:      'Cumplimiento Fichas Clínicas',
    empresa:     'Clínica Maipú',
    sector:      'Salud',
    po:          'Dra. S. Rojas',
    estado:      'En diagnóstico',
    progreso:    30,
    inicio:      '2026-02-01',
    descripcion: 'Diagnóstico del tratamiento de datos sensibles en fichas clínicas digitales.',
  },
  {
    id:          '3',
    nombre:      'Onboarding Digital',
    empresa:     'Fintech Valpo',
    sector:      'Finanzas',
    po:          'C. Pérez',
    estado:      'Completado',
    progreso:    100,
    inicio:      '2025-11-10',
    descripcion: 'Implementación de flujo de onboarding con consentimiento informado y tratamiento de datos.',
  },
]

const ESTADO_STYLES: Record<EstadoProyecto, string> = {
  'Iniciado':         'bg-surface-variant text-outline',
  'En diagnóstico':   'bg-primary-container text-on-primary-container',
  'En remediación':   'bg-tertiary-container/30 text-on-tertiary-container',
  'Completado':       'bg-secondary-fixed text-on-secondary-fixed-variant',
}

const PROGRESO_COLOR: Record<EstadoProyecto, string> = {
  'Iniciado':         'bg-outline',
  'En diagnóstico':   'bg-primary',
  'En remediación':   'bg-tertiary-container',
  'Completado':       'bg-secondary',
}

interface EditForm {
  nombre:      string
  descripcion: string
  po:          string
  estado:      EstadoProyecto
}

export function EjecutivoContent({ user }: { user: AppUser }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>(PROYECTOS_MOCK)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [estadoOpen, setEstadoOpen] = useState<string | null>(null)
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('')

  const proyectosFiltrados = filtroEmpresa.trim() === ''
    ? proyectos
    : proyectos.filter(p =>
        p.empresa.toLowerCase().includes(filtroEmpresa.toLowerCase())
      )

  function openEdit(p: Proyecto) {
    setEditingId(p.id)
    setEditForm({ nombre: p.nombre, descripcion: p.descripcion, po: p.po, estado: p.estado })
  }

  function closeEdit() {
    setEditingId(null)
    setEditForm(null)
  }

  function saveEdit(id: string) {
    if (!editForm) return
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p))
    closeEdit()
  }

  function changeEstado(id: string, estado: EstadoProyecto) {
    setProyectos(prev => prev.map(p => {
      if (p.id !== id) return p
      const progreso = estado === 'Iniciado' ? 5
        : estado === 'En diagnóstico' ? 30
        : estado === 'En remediación' ? 65
        : 100
      return { ...p, estado, progreso }
    }))
    setEstadoOpen(null)
  }

  const nombre = user.user_metadata.nombre ?? user.email.split('@')[0]

  return (
    <div className="flex-1 md:ml-64 min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur border-b border-surface-variant/30 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban size={20} className="text-secondary" />
          <div>
            <h1 className="text-lg font-bold text-on-surface leading-tight">Panel Ejecutivo</h1>
            <p className="text-xs text-on-surface-variant">Bienvenido, {nombre}</p>
          </div>
        </div>
        <span className="bg-primary-container text-on-primary-container text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
          Ejecutivo
        </span>
      </header>

      <main className="flex-1 px-8 py-10 space-y-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary tracking-tight mb-1">Mis Proyectos</h2>
            <p className="text-sm text-on-surface-variant">
              {proyectosFiltrados.length} de {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''}
            </p>
          </div>
          {/* Filtro por empresa */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={filtroEmpresa}
              onChange={e => setFiltroEmpresa(e.target.value)}
              className="w-full bg-surface-container border border-surface-variant/50 rounded-lg pl-8 pr-3 py-1.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {proyectosFiltrados.map(p => (
            <article key={p.id} className="bg-surface-container-lowest rounded-xl border border-surface-variant/40 shadow-ambient-sm overflow-visible">
              {/* Card header */}
              <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 size={13} className="text-outline shrink-0" />
                    <span className="text-xs text-outline">{p.empresa} · {p.sector}</span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface truncate">{p.nombre}</h3>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{p.descripcion}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-outline">
                    <span className="flex items-center gap-1">
                      <User size={12} /> PO: <strong className="text-on-surface-variant">{p.po}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Inicio: {new Date(p.inicio).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Estado dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setEstadoOpen(estadoOpen === p.id ? null : p.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${ESTADO_STYLES[p.estado]}`}
                    >
                      {p.estado}
                      <ChevronDown size={12} className={`transition-transform ${estadoOpen === p.id ? 'rotate-180' : ''}`} />
                    </button>
                    {estadoOpen === p.id && (
                      <div className="absolute right-0 top-full mt-1 z-50 bg-surface-container-lowest border border-surface-variant/50 rounded-xl shadow-ambient-md overflow-hidden w-48">
                        {ESTADOS_PROYECTO.map(e => (
                          <button
                            key={e}
                            onClick={() => changeEstado(p.id, e)}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-surface-container ${p.estado === e ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                          >
                            {e}
                            {p.estado === e && <Check size={13} className="text-secondary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    <Pencil size={12} /> Editar
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 pb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-on-surface-variant">Progreso general</span>
                  <span className="text-xs font-bold text-on-surface-variant">{p.progreso}%</span>
                </div>
                <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${PROGRESO_COLOR[p.estado]}`}
                    style={{ width: `${p.progreso}%` }}
                  />
                </div>

                {/* Estado steps — 4 dots + 3 connecting lines */}
                <div className="mt-3">
                  <div className="flex items-center">
                    {ESTADOS_PROYECTO.map((e, i) => {
                      const idx = ESTADOS_PROYECTO.indexOf(p.estado)
                      const active = i <= idx
                      const isLast = i === ESTADOS_PROYECTO.length - 1
                      return (
                        <div key={e} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 transition-all ${
                            active
                              ? `${PROGRESO_COLOR[p.estado]} border-transparent`
                              : 'bg-surface-container-lowest border-tertiary/40'
                          }`} />
                          {!isLast && (
                            <div className={`flex-1 h-0.5 transition-colors ${
                              i < idx ? PROGRESO_COLOR[p.estado] : 'bg-tertiary/30'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-4 mt-1.5">
                    {ESTADOS_PROYECTO.map((e, i) => {
                      const idx = ESTADOS_PROYECTO.indexOf(p.estado)
                      const isLast = i === ESTADOS_PROYECTO.length - 1
                      return (
                        <span
                          key={e}
                          className={`text-[0.6rem] uppercase tracking-wide ${isLast ? 'text-right' : 'text-left'} ${
                            i <= idx ? 'text-on-surface-variant font-semibold' : 'text-tertiary'
                          }`}
                        >
                          {e}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Edit modal */}
      {editingId && editForm && (() => {
        const p = proyectos.find(x => x.id === editingId)!
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-md w-full max-w-lg">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-variant/30">
                <div>
                  <h2 className="text-base font-bold text-on-surface">Editar proyecto</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">{p.empresa}</p>
                </div>
                <button onClick={closeEdit} className="text-outline hover:text-on-surface transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                    Nombre del proyecto
                  </label>
                  <input
                    className="w-full bg-surface-container border border-surface-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                    value={editForm.nombre}
                    onChange={e => setEditForm(f => f ? { ...f, nombre: e.target.value } : f)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-surface-container border border-surface-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors resize-none"
                    value={editForm.descripcion}
                    onChange={e => setEditForm(f => f ? { ...f, descripcion: e.target.value } : f)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                    Product Owner
                  </label>
                  <input
                    className="w-full bg-surface-container border border-surface-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors"
                    value={editForm.po}
                    onChange={e => setEditForm(f => f ? { ...f, po: e.target.value } : f)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                    Estado del proceso
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ESTADOS_PROYECTO.map(e => (
                      <button
                        key={e}
                        onClick={() => setEditForm(f => f ? { ...f, estado: e } : f)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors border ${
                          editForm.estado === e
                            ? 'border-secondary bg-secondary-fixed/20 text-on-secondary-fixed-variant'
                            : 'border-surface-variant/50 bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex justify-end gap-3">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border border-surface-variant/50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => saveEdit(editingId)}
                  className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-secondary to-primary text-on-primary rounded-lg shadow-ambient-sm hover:brightness-110 transition-all"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
