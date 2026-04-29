'use client'

import { useState } from 'react'
import { Settings2, X, Search, Mail, UserPlus, ChevronRight, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AreaResumen {
  id_area: number
  nombre_area: string
  encargado: string | null
  pct_avance: number
}

interface CatArea {
  id_area: number
  nombre_area: string
  descripcion: string | null
}

interface UsuarioExistente {
  id_mae_usuario: string
  nombre_usuario: string
}

interface ResumenAreasProps {
  areas: AreaResumen[]
  catalogoAreas: CatArea[]
  proyectoId: string
  empresaId: string
}

type ModoAsignacion = 'existente' | 'nuevo'

interface AsignacionArea {
  areaId: number
  modo: ModoAsignacion
  usuarioId: string
  nombre: string
  correo: string
}

export function ResumenAreas({ areas, catalogoAreas, proyectoId, empresaId }: ResumenAreasProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [areasLocales, setAreasLocales] = useState<AreaResumen[]>(areas)
  const [asignaciones, setAsignaciones] = useState<Record<number, AsignacionArea>>({})
  const [busqueda, setBusqueda] = useState<Record<number, string>>({})
  const [resultados, setResultados] = useState<Record<number, UsuarioExistente[]>>({})
  const [modos, setModos] = useState<Record<number, ModoAsignacion>>({})
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const estadoColor = (pct: number) => {
    if (pct === 0)   return 'bg-surface-container-high text-on-surface-variant'
    if (pct < 50)    return 'bg-tertiary-container/10 text-tertiary-container'
    if (pct < 100)   return 'bg-secondary/10 text-secondary'
    return 'bg-secondary/20 text-secondary'
  }

  const estadoLabel = (pct: number) => {
    if (pct === 0)   return 'Sin iniciar'
    if (pct < 50)    return 'En progreso'
    if (pct < 100)   return 'Avanzado'
    return 'Completado'
  }

  async function buscarUsuarios(idArea: number, query: string) {
    setBusqueda(prev => ({ ...prev, [idArea]: query }))
    if (query.length < 2) { setResultados(prev => ({ ...prev, [idArea]: [] })); return }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any
    const { data } = await db
      .from('maeusuario')
      .select('id_mae_usuario, nombre_usuario')
      .ilike('nombre_usuario', `%${query}%`)
      .eq('activo', true)
      .limit(5)
    setResultados(prev => ({ ...prev, [idArea]: (data as UsuarioExistente[]) ?? [] }))
  }

  function setModo(idArea: number, modo: ModoAsignacion) {
    setModos(prev => ({ ...prev, [idArea]: modo }))
    setAsignaciones(prev => {
      const updated = { ...prev }
      delete updated[idArea]
      return updated
    })
    setBusqueda(prev => ({ ...prev, [idArea]: '' }))
    setResultados(prev => ({ ...prev, [idArea]: [] }))
  }

  function seleccionarUsuario(idArea: number, u: UsuarioExistente) {
    setAsignaciones(prev => ({
      ...prev,
      [idArea]: { areaId: idArea, modo: 'existente', usuarioId: u.id_mae_usuario, nombre: u.nombre_usuario, correo: '' },
    }))
    setBusqueda(prev => ({ ...prev, [idArea]: u.nombre_usuario }))
    setResultados(prev => ({ ...prev, [idArea]: [] }))
  }

  function setCorreoNuevo(idArea: number, correo: string, nombre: string) {
    setAsignaciones(prev => ({
      ...prev,
      [idArea]: { areaId: idArea, modo: 'nuevo', usuarioId: '', nombre, correo },
    }))
  }

  async function guardar() {
    setGuardando(true)
    setError(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any

    try {
      for (const [idAreaStr, asig] of Object.entries(asignaciones)) {
        const idArea = Number(idAreaStr)

        if (asig.modo === 'existente' && asig.usuarioId) {
          await db.rpc('sp_asigna_encargado_area', {
            p_id_mae_usuario_encargado: asig.usuarioId,
            p_id_area: idArea,
            p_id_mae_proyecto: proyectoId,
            p_id_mae_empresa: empresaId,
          })
        } else if (asig.modo === 'nuevo' && asig.correo) {
          const res = await fetch('/api/invitar-encargado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              correo: asig.correo,
              nombre: asig.nombre,
              idArea,
              idProyecto: proyectoId,
              idEmpresa: empresaId,
            }),
          })
          if (!res.ok) throw new Error('Error al invitar encargado')
        }

        // Actualizar estado local
        setAreasLocales(prev => prev.map(a =>
          a.id_area === idArea ? { ...a, encargado: asig.nombre } : a
        ))
      }

      setModalOpen(false)
      setAsignaciones({})
      setBusqueda({})
      setModos({})
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar cambios')
    } finally {
      setGuardando(false)
    }
  }

  const areasAMostrar = areasLocales.length > 0 ? areasLocales : []

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-primary text-[2rem] font-bold leading-tight">Resumen de áreas</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-md h-10 px-5 bg-gradient-secondary text-on-secondary text-sm font-bold shadow-ambient hover:brightness-110 transition-all"
        >
          <Settings2 size={15} /> Configurar áreas
        </button>
      </div>

      {areasAMostrar.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-surface-container-low border border-outline-variant/15 border-dashed py-16">
          <Users size={32} className="text-outline opacity-40" />
          <div className="text-center">
            <p className="text-on-surface font-bold">Sin áreas configuradas</p>
            <p className="text-on-surface-variant text-sm mt-1">
              Haz clic en &quot;Configurar áreas&quot; para asignar áreas y encargados a este proyecto.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-secondary border border-secondary/30 rounded-lg px-4 py-2 hover:bg-secondary/5 transition-colors"
          >
            <Settings2 size={14} /> Configurar ahora
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-outline-variant/15 overflow-hidden shadow-ambient">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant">
                <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Área</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Responsable</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estado de avance</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {areasAMostrar.map(area => (
                <tr key={area.id_area} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-md bg-primary-container/10 text-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                        {area.nombre_area.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-on-surface">{area.nombre_area}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {area.encargado ? (
                      <span className="text-sm text-on-surface">{area.encargado}</span>
                    ) : (
                      <span className="text-sm text-outline italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full"
                          style={{ width: `${area.pct_avance}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoColor(area.pct_avance)}`}>
                        {estadoLabel(area.pct_avance)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-xs font-bold text-secondary flex items-center gap-1 ml-auto hover:opacity-80"
                    >
                      Modificar <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal configurar áreas */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant shrink-0">
              <h2 className="text-base font-bold text-on-surface">Configurar áreas del proyecto</h2>
              <button onClick={() => setModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-4">
              <p className="text-sm text-on-surface-variant">
                Asigna un encargado a cada área. Puedes buscar un usuario existente o invitar uno nuevo por correo.
              </p>

              {catalogoAreas.map(cat => {
                const areaActual = areasLocales.find(a => a.id_area === cat.id_area)
                const modo = modos[cat.id_area] ?? 'existente'
                const asig = asignaciones[cat.id_area]

                return (
                  <div key={cat.id_area} className="rounded-lg border border-outline-variant/15 bg-surface-container-low p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded bg-primary-container/10 text-primary-container flex items-center justify-center text-xs font-bold">
                          {cat.nombre_area.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-on-surface">{cat.nombre_area}</span>
                      </div>
                      {areaActual?.encargado && (
                        <span className="text-xs text-on-surface-variant">
                          Actual: <span className="font-medium">{areaActual.encargado}</span>
                        </span>
                      )}
                    </div>

                    {/* Toggle modo */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModo(cat.id_area, 'existente')}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                          modo === 'existente'
                            ? 'bg-primary-container/15 text-primary-container border border-primary-container/30'
                            : 'text-on-surface-variant hover:bg-surface-container-high border border-transparent'
                        }`}
                      >
                        <Search size={11} /> Buscar usuario
                      </button>
                      <button
                        onClick={() => setModo(cat.id_area, 'nuevo')}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                          modo === 'nuevo'
                            ? 'bg-secondary/10 text-secondary border border-secondary/30'
                            : 'text-on-surface-variant hover:bg-surface-container-high border border-transparent'
                        }`}
                      >
                        <UserPlus size={11} /> Invitar por correo
                      </button>
                    </div>

                    {/* Modo existente */}
                    {modo === 'existente' && (
                      <div className="relative">
                        <div className="flex items-center gap-2 border border-outline-variant/30 rounded-md bg-surface-container-lowest px-3 py-2">
                          <Search size={13} className="text-outline shrink-0" />
                          <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={busqueda[cat.id_area] ?? ''}
                            onChange={e => buscarUsuarios(cat.id_area, e.target.value)}
                            className="flex-1 text-sm bg-transparent outline-none text-on-surface placeholder:text-outline"
                          />
                        </div>
                        {(resultados[cat.id_area] ?? []).length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-10 overflow-hidden">
                            {resultados[cat.id_area].map(u => (
                              <button
                                key={u.id_mae_usuario}
                                onClick={() => seleccionarUsuario(cat.id_area, u)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low transition-colors text-on-surface"
                              >
                                {u.nombre_usuario}
                              </button>
                            ))}
                          </div>
                        )}
                        {asig?.modo === 'existente' && asig.nombre && (
                          <p className="text-xs text-secondary font-medium mt-1">✓ Seleccionado: {asig.nombre}</p>
                        )}
                      </div>
                    )}

                    {/* Modo nuevo */}
                    {modo === 'nuevo' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 border border-outline-variant/30 rounded-md bg-surface-container-lowest px-3 py-2">
                          <UserPlus size={13} className="text-outline shrink-0" />
                          <input
                            type="text"
                            placeholder="Nombre completo"
                            onChange={e => setCorreoNuevo(cat.id_area, asig?.correo ?? '', e.target.value)}
                            className="flex-1 text-sm bg-transparent outline-none text-on-surface placeholder:text-outline"
                          />
                        </div>
                        <div className="flex items-center gap-2 border border-outline-variant/30 rounded-md bg-surface-container-lowest px-3 py-2">
                          <Mail size={13} className="text-outline shrink-0" />
                          <input
                            type="email"
                            placeholder="correo@empresa.cl"
                            onChange={e => setCorreoNuevo(cat.id_area, e.target.value, asig?.nombre ?? '')}
                            className="flex-1 text-sm bg-transparent outline-none text-on-surface placeholder:text-outline"
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant">
                          Se creará una cuenta y recibirá sus credenciales. Tiene 48 horas para activarla.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {error && (
              <p className="px-6 py-2 text-sm text-error font-medium bg-error/5 border-t border-error/20">{error}</p>
            )}

            <div className="px-6 py-4 border-t border-surface-variant flex gap-3 justify-end shrink-0">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-on-surface-variant border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando || Object.keys(asignaciones).length === 0}
                className="px-5 py-2 text-sm font-bold bg-gradient-secondary text-on-secondary rounded-lg shadow-ambient hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
