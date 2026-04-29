'use client'

import { useState } from 'react'
import { X, Briefcase, ArrowRight, Calendar, Activity } from 'lucide-react'

interface Proyecto {
  id: string
  nombre: string
  estado: string
  estadoProceso: string
  empresa: string
  fechaInicio: string | null
  fechaFin: string | null
}

interface DetalleProyectoModalProps {
  proyecto: Proyecto | null
}

const PROCESO_STEPS = ['Iniciado', 'En diagnóstico', 'En remediación', 'Completado']

const PROCESO_COLORS: Record<string, string> = {
  'Iniciado':       'bg-surface-container-high text-on-surface-variant',
  'En diagnóstico': 'bg-primary-container/10 text-primary-container',
  'En remediación': 'bg-secondary/10 text-secondary',
  'Completado':     'bg-secondary/20 text-secondary',
}

export function DetalleProyectoModal({ proyecto }: DetalleProyectoModalProps) {
  const [open, setOpen] = useState(false)

  const stepIndex = proyecto ? PROCESO_STEPS.indexOf(proyecto.estadoProceso) : -1
  const pctProceso = stepIndex >= 0 ? Math.round(((stepIndex + 1) / PROCESO_STEPS.length) * 100) : 0

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg bg-surface-container-low p-6 border border-outline-variant/15 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />
        <div className="flex items-center justify-center size-12 rounded-full bg-primary-container/10 text-primary-container">
          <Briefcase size={22} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-primary text-lg font-bold leading-tight">
            {proyecto
              ? `Proyecto activo: ${proyecto.nombre} — ${proyecto.empresa}`
              : 'Sin proyecto activo asignado'}
          </p>
          <p className="text-on-surface-variant text-sm">Product Owner Asignado</p>
        </div>
        {proyecto && (
          <div className="ml-auto">
            <button
              onClick={() => setOpen(true)}
              className="text-secondary font-bold text-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              Ver detalles del proyecto <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {open && proyecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant">
              <h2 className="text-base font-bold text-on-surface">Detalle del proyecto</h2>
              <button onClick={() => setOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 flex flex-col gap-6">
              {/* Info básica */}
              <div className="flex flex-col gap-1">
                <h3 className="text-primary text-xl font-bold">{proyecto.nombre}</h3>
                <p className="text-on-surface-variant text-sm">{proyecto.empresa}</p>
              </div>

              {/* Estado proceso */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estado del proceso</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PROCESO_COLORS[proyecto.estadoProceso] ?? ''}`}>
                    {proyecto.estadoProceso}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${pctProceso}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  {PROCESO_STEPS.map((step, i) => (
                    <span
                      key={step}
                      className={`text-[10px] font-medium ${i <= stepIndex ? 'text-secondary' : 'text-outline'}`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                  <Calendar size={16} className="text-outline shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Inicio</p>
                    <p className="text-sm font-bold text-on-surface">
                      {proyecto.fechaInicio
                        ? new Date(proyecto.fechaInicio).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                  <Calendar size={16} className="text-outline shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Fecha estimada</p>
                    <p className="text-sm font-bold text-on-surface">
                      {proyecto.fechaFin
                        ? new Date(proyecto.fechaFin).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                <Activity size={16} className="text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Estado</p>
                  <p className="text-sm font-bold text-secondary">{proyecto.estado}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 text-sm font-bold text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
