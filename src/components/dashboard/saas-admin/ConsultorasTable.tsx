'use client'

import { useState } from 'react'
import { Search, Plus, MoreVertical, Edit, FileText, CheckCircle2, XCircle } from 'lucide-react'

type Estado = 'Activa' | 'Inactiva' | 'Pendiente'

interface Consultora {
  id: string
  nombre: string
  rut: string
  responsable: string
  email: string
  suscripcion: string
  fechaIngreso: string
  estado: Estado
}

const DEMO_CONSULTORAS: Consultora[] = [
  { id: '1', nombre: 'DatCore Consulting', rut: '76.123.456-K', responsable: 'Admin Global', email: 'admin@datcore.cl', suscripcion: 'Enterprise', fechaIngreso: '01/01/2026', estado: 'Activa' },
  { id: '2', nombre: 'Consultores & Asoc', rut: '77.888.999-1', responsable: 'Marta Pérez', email: 'marta@consultores.cl', suscripcion: 'Pro', fechaIngreso: '15/02/2026', estado: 'Activa' },
  { id: '3', nombre: 'Auditoría LegalTech', rut: '78.555.444-2', responsable: 'Juan González', email: 'jgonzalez@legaltech.cl', suscripcion: 'Starter', fechaIngreso: '10/03/2026', estado: 'Inactiva' },
  { id: '4', nombre: 'Seguridad IT Global', rut: '79.222.111-3', responsable: 'Pedro Silva', email: 'psilva@seguridadit.com', suscripcion: 'Pro', fechaIngreso: '05/04/2026', estado: 'Pendiente' },
]

const ESTADO_STYLES: Record<Estado, { badge: string; text: string, icon: any }> = {
  'Activa': { badge: 'bg-secondary-fixed text-on-secondary-fixed-variant', text: 'Activa', icon: CheckCircle2 },
  'Inactiva': { badge: 'bg-error-container text-tertiary-container', text: 'Inactiva', icon: XCircle },
  'Pendiente': { badge: 'bg-surface-variant text-outline', text: 'Pendiente', icon: FileText },
}

export function ConsultorasTable() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = DEMO_CONSULTORAS.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.responsable.toLowerCase().includes(search.toLowerCase()) ||
    c.rut.includes(search)
  )

  return (
    <section className="flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Empresas Consultoras</h2>
          <p className="text-sm text-on-surface-variant mt-1">Gestión de consultoras y sus responsables.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-shimmer bg-gradient-to-r from-secondary to-primary text-white hover:brightness-110 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-ambient"
        >
          <Plus size={18} /> Agregar Consultora
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-lg shadow-ambient-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 bg-surface-container-low/50 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-surface-variant/30">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
            <input
              className="w-full bg-surface-container-lowest border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 pl-10 pr-4 transition-colors"
              placeholder="Buscar por nombre, RUT o responsable..."
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
                <th className="p-4">Consultora / RUT</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Suscripción</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const stateStyle = ESTADO_STYLES[c.estado]
                const StatusIcon = stateStyle.icon
                return (
                  <tr key={c.id} className="border-t border-surface-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-primary">{c.nombre}</div>
                      <div className="text-xs text-outline">{c.rut}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface-variant">
                      {c.responsable}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {c.email}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-surface-container text-on-surface-variant">
                        {c.suscripcion}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${stateStyle.badge}`}>
                        <StatusIcon size={14} />
                        {stateStyle.text}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-outline-variant hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-outline-variant hover:text-primary hover:bg-surface-variant rounded-full transition-colors ml-1" title="Ver opciones">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant text-sm">
                    No se encontraron consultoras.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-surface-variant/30 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-primary">Agregar Empresa Consultora</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline-variant hover:text-error transition-colors p-1">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Datos de la empresa</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Nombre Consultora</label>
                    <input type="text" className="w-full bg-white border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 px-3 transition-colors" placeholder="Ej: Consultores SPA" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">RUT / Identificación</label>
                    <input type="text" className="w-full bg-white border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 px-3 transition-colors" placeholder="Ej: 76.123.456-7" />
                  </div>
                </div>
              </div>

              <hr className="border-surface-variant/30" />

              <div>
                <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Datos del Responsable</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Nombre Completo</label>
                    <input type="text" className="w-full bg-white border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 px-3 transition-colors" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Correo Electrónico (Inicio de Sesión)</label>
                    <input type="email" className="w-full bg-white border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 px-3 transition-colors" placeholder="Ej: jperez@consultora.cl" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Suscripción Asignada</label>
                    <select className="w-full bg-white border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 text-sm py-2 px-3 transition-colors">
                      <option>Starter</option>
                      <option>Pro</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-surface-variant/30 flex justify-end gap-3 bg-surface-container/30 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('Consultora creada y configurada exitosamente. Se le enviará un correo al responsable.')
                  setIsModalOpen(false)
                }}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:brightness-110 transition-colors shadow-ambient-sm"
              >
                Guardar Consultora
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
