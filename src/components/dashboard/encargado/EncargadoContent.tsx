'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  FileText, ChevronRight, Clock, CircleDot, CheckCircle2,
  LogOut, Layers, CheckCheck, BarChart3, FolderOpen, Tag,
  type LucideIcon,
} from 'lucide-react'
import type { AppUser } from '@/types/user'
import type { AreaEncargado } from '@/types/cuestionario'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  user: AppUser
  areas: AreaEncargado[]
}

type EstadoFilter = 'todos' | 'pendiente' | 'en_progreso' | 'completado'
type AreaFilter   = 'todos' | number

const STATUS_CONFIG = {
  pendiente:   { label: 'Pendiente',   Icon: Clock,        color: 'text-on-surface-variant', bg: 'bg-surface-container',  border: '' },
  en_progreso: { label: 'En progreso', Icon: CircleDot,    color: 'text-secondary',          bg: 'bg-secondary/10',        border: '' },
  completado:  { label: 'Completado',  Icon: CheckCircle2, color: 'text-[#2e7d32]',          bg: 'bg-[#e8f5e9]',           border: '' },
}

export function EncargadoContent({ user, areas }: Props) {
  const router  = useRouter()
  const nombre  = user.user_metadata?.nombre ?? user.email.split('@')[0]

  const [proyectoFilter, setProyectoFilter] = useState<string>('todos')
  const [areaFilter,     setAreaFilter]     = useState<AreaFilter>('todos')
  const [estadoFilter,   setEstadoFilter]   = useState<EstadoFilter>('todos')

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ── Proyectos únicos para el filtro
  const proyectos = useMemo(() => {
    const map = new Map<string, string>()
    areas.forEach(a => map.set(a.id_mae_proyecto, a.nombre_proyecto))
    return [...map.entries()].map(([id, nombre]) => ({ id, nombre }))
  }, [areas])

  const multiProyecto = proyectos.length > 1

  // ── Áreas únicas para el filtro
  const areasUnicas = useMemo(() => {
    const map = new Map<number, string>()
    areas.forEach(a => map.set(a.id_area, a.nombre_area))
    return [...map.entries()].map(([id, nombre]) => ({ id, nombre }))
  }, [areas])

  const multiArea = areasUnicas.length > 1

  // ── Áreas filtradas
  const areasFiltradas = useMemo(() => {
    return areas.filter(a => {
      const okProyecto = proyectoFilter === 'todos' || a.id_mae_proyecto === proyectoFilter
      const okArea     = areaFilter     === 'todos' || a.id_area === areaFilter
      const okEstado   = estadoFilter   === 'todos' || a.estado === estadoFilter
      return okProyecto && okArea && okEstado
    })
  }, [areas, proyectoFilter, areaFilter, estadoFilter])

  // ── Métricas globales
  const total      = areas.length
  const completados = areas.filter(a => a.estado === 'completado').length
  const enProgreso  = areas.filter(a => a.estado === 'en_progreso').length
  const pendientes  = areas.filter(a => a.estado === 'pendiente').length
  const pctGlobal   = total > 0 ? Math.round((completados / total) * 100) : 0

  return (
    <div className="flex-1 flex flex-col md:ml-64">

      {/* ── TopBar */}
      <header className="sticky top-0 z-10 flex justify-between items-center px-8 h-16 bg-surface-container-low/80 backdrop-blur-sm border-b border-outline-variant/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_datcore.png" alt="DatCore" className="h-8 w-auto" />
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold text-secondary border border-outline-variant/20">
            Encargado de Área
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold select-none">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 text-outline hover:text-on-surface transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Contenido */}
      <main className="flex-1 px-8 py-10 max-w-3xl mx-auto w-full">

        {/* Header de bienvenida */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Panel de encargado
          </p>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Hola, {nombre}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Aquí puedes ver y completar los diagnósticos asignados para la Ley 21.719.
          </p>
        </div>

        {/* ── KPIs */}
        {areas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <KpiCard
              label="Total"
              value={total}
              Icon={Layers}
              colorClass="text-primary"
              bgClass="bg-primary/10"
            />
            <KpiCard
              label="Completados"
              value={completados}
              Icon={CheckCheck}
              colorClass="text-[#2e7d32]"
              bgClass="bg-[#e8f5e9]"
            />
            <KpiCard
              label="En progreso"
              value={enProgreso}
              Icon={BarChart3}
              colorClass="text-secondary"
              bgClass="bg-secondary/10"
            />
            <KpiCard
              label="Pendientes"
              value={pendientes}
              Icon={Clock}
              colorClass="text-on-surface-variant"
              bgClass="bg-surface-container"
            />
          </div>
        )}

        {/* Barra de progreso global */}
        {areas.length > 0 && (
          <div className="mb-8 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                Progreso general
              </span>
              <span className="text-sm font-bold text-on-surface tabular-nums">
                {completados}/{total} completados · {pctGlobal}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-700"
                style={{ width: `${pctGlobal}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Sección cuestionarios */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-on-surface">Mis cuestionarios</h2>
          {areas.length > 0 && (
            <span className="text-xs text-on-surface-variant">
              {areasFiltradas.length} de {total}
            </span>
          )}
        </div>

        {/* ── Filtros */}
        {areas.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">

            {/* Filtro por proyecto (solo si hay más de uno) */}
            {multiProyecto && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <FolderOpen size={12} className="text-on-surface-variant shrink-0" />
                {[{ id: 'todos', nombre: 'Todos los proyectos' }, ...proyectos].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProyectoFilter(p.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      proyectoFilter === p.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {p.nombre}
                  </button>
                ))}
              </div>
            )}

            {/* Filtro por área (solo si hay más de una) */}
            {multiArea && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag size={12} className="text-on-surface-variant shrink-0" />
                <button
                  onClick={() => setAreaFilter('todos')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    areaFilter === 'todos'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Todas las áreas
                </button>
                {areasUnicas.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAreaFilter(a.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      areaFilter === a.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {a.nombre}
                  </button>
                ))}
              </div>
            )}

            {/* Filtro por estado */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['todos', 'pendiente', 'en_progreso', 'completado'] as const).map(estado => {
                const labels: Record<typeof estado, string> = {
                  todos:       'Todos',
                  pendiente:   'Pendiente',
                  en_progreso: 'En progreso',
                  completado:  'Completado',
                }
                return (
                  <button
                    key={estado}
                    onClick={() => setEstadoFilter(estado)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      estadoFilter === estado
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {labels[estado]}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Lista de cuestionarios */}
        {areas.length === 0 ? (
          <EmptyState />
        ) : areasFiltradas.length === 0 ? (
          <div className="py-12 text-center text-sm text-on-surface-variant">
            Sin cuestionarios para los filtros seleccionados.
          </div>
        ) : (
          <div className="space-y-3">
            {areasFiltradas.map(area => (
              <AreaCard
                key={`${area.id_mae_proyecto}-${area.id_area}`}
                area={area}
                showProyecto={multiProyecto}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ── KPI Card */
function KpiCard({
  label, value, Icon, colorClass, bgClass,
}: {
  label: string
  value: number
  Icon: LucideIcon
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={colorClass} />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${colorClass}`}>{value}</p>
        <p className="text-[0.65rem] text-on-surface-variant mt-0.5 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}

/* ── Tarjeta de cuestionario por área */
function AreaCard({ area, showProyecto }: { area: AreaEncargado; showProyecto: boolean }) {
  const cfg = STATUS_CONFIG[area.estado]
  const { Icon } = cfg

  const href = `/encargado/formulario/${area.id_area}?proyecto=${area.id_mae_proyecto}`

  const btnLabel =
    area.estado === 'completado'  ? 'Ver respuestas' :
    area.estado === 'en_progreso' ? 'Continuar'       :
    'Comenzar'

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-md transition-all border border-transparent hover:border-outline-variant/30"
    >
      {/* Ícono */}
      <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
        <FileText size={20} className="text-secondary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            <Icon size={10} />
            {cfg.label}
          </span>
          <span className="text-[0.65rem] text-on-surface-variant">
            {area.total_preguntas} preguntas
          </span>
          {showProyecto && (
            <span className="text-[0.65rem] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {area.nombre_proyecto}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-on-surface text-sm leading-snug">
          {area.nombre_area}
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {area.respondidas} de {area.total_preguntas} respondidas
        </p>

        {/* Barra de progreso */}
        {area.progreso > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  area.estado === 'completado' ? 'bg-[#2e7d32]' : 'bg-secondary'
                }`}
                style={{ width: `${area.progreso}%` }}
              />
            </div>
            <span className="text-[0.65rem] font-bold text-on-surface-variant tabular-nums">
              {area.progreso}%
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:block text-xs font-bold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          {btnLabel}
        </span>
        <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
      </div>
    </Link>
  )
}

/* ── Estado vacío */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4">
        <Layers size={24} className="text-on-surface-variant opacity-40" />
      </div>
      <p className="text-sm font-semibold text-on-surface mb-1">Sin cuestionarios asignados</p>
      <p className="text-xs text-on-surface-variant max-w-xs">
        Tu Product Owner aún no ha asignado áreas. Te llegará una notificación cuando estén disponibles.
      </p>
    </div>
  )
}
