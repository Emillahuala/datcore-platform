'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Notificacion {
  id_notificacion: number
  tipo: string
  titulo: string
  mensaje: string
  leida: boolean
  link_destino: string | null
  fecha_mov: string
}

interface NotificacionesPanelProps {
  initialCount: number
  usuarioId: string
}

export function NotificacionesPanel({ initialCount, usuarioId }: NotificacionesPanelProps) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [notifs, setNotifs] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleOpen() {
    if (!open) {
      setOpen(true)
      setLoading(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any
      const { data } = await supabase
        .from('movnotificacion')
        .select('id_notificacion, tipo, titulo, mensaje, leida, link_destino, fecha_mov')
        .eq('id_mae_usuario', usuarioId)
        .order('fecha_mov', { ascending: false })
        .limit(20)
      setNotifs((data as Notificacion[]) ?? [])
      setLoading(false)
    } else {
      setOpen(false)
    }
  }

  async function marcarLeida(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    await supabase.from('movnotificacion').update({ leida: true }).eq('id_notificacion', id)
    setNotifs(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n))
    setCount(prev => Math.max(0, prev - 1))
  }

  async function marcarTodasLeidas() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    await supabase.from('movnotificacion')
      .update({ leida: true })
      .eq('id_mae_usuario', usuarioId)
      .eq('leida', false)
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))
    setCount(0)
  }

  const tipoColor: Record<string, string> = {
    area_asignada:           'bg-secondary/10 text-secondary',
    cambio_estado:           'bg-primary-container/10 text-primary-container',
    invitacion:              'bg-tertiary-container/10 text-tertiary-container',
    cuestionario_completado: 'bg-secondary/10 text-secondary',
    cambio_encargado:        'bg-primary-container/10 text-primary-container',
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative text-outline hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-low"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-96 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-variant">
            <h3 className="text-sm font-bold text-on-surface">Notificaciones</h3>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  onClick={marcarTodasLeidas}
                  className="text-xs text-secondary font-medium flex items-center gap-1 hover:opacity-80"
                >
                  <CheckCheck size={12} /> Marcar todas leídas
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-outline hover:text-on-surface p-0.5">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center h-20 text-on-surface-variant text-sm">
                Cargando...
              </div>
            )}
            {!loading && notifs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-24 gap-2 text-on-surface-variant">
                <Bell size={20} className="opacity-30" />
                <p className="text-sm">Sin notificaciones</p>
              </div>
            )}
            {!loading && notifs.map(n => (
              <div
                key={n.id_notificacion}
                className={`flex items-start gap-3 px-4 py-3 border-b border-surface-variant/50 transition-colors ${
                  n.leida ? 'bg-surface-container-lowest' : 'bg-secondary/5'
                }`}
              >
                <span className={`mt-0.5 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${tipoColor[n.tipo] ?? 'bg-surface-container text-on-surface-variant'}`}>
                  {n.tipo.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-tight ${n.leida ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                    {n.titulo}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{n.mensaje}</p>
                  <p className="text-[10px] text-outline mt-1">
                    {new Date(n.fecha_mov).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.leida && (
                  <button
                    onClick={() => marcarLeida(n.id_notificacion)}
                    className="shrink-0 text-outline hover:text-secondary p-1 rounded"
                    title="Marcar como leída"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
