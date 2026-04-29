'use client'

import { useState } from 'react'
import { X, Building2, User, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────── */
interface EmpresaForm {
  nombre:     string
  sector:     string
  industria:  string
  contacto:   string
  email:      string
  telefono:   string
}

interface POForm {
  nombre:   string
  email:    string
  telefono: string
}

const SECTORES = [
  'Salud', 'Finanzas', 'Construcción', 'Retail', 'Logística',
  'Tecnología', 'Educación', 'Agroindustria', 'Legal', 'Otro',
]

const EMPTY_EMPRESA: EmpresaForm = {
  nombre: '', sector: '', industria: '', contacto: '', email: '', telefono: '',
}

const EMPTY_PO: POForm = { nombre: '', email: '', telefono: '' }

/* ─── Step indicator ─────────────────────────────────── */
function StepDot({ n, current, done }: { n: number; current: number; done: boolean }) {
  const active = n === current
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
      done    ? 'bg-secondary border-secondary text-on-secondary'
      : active ? 'bg-primary border-primary text-on-primary'
               : 'bg-surface-container border-surface-variant text-outline'
    }`}>
      {done ? <CheckCircle2 size={14} /> : n}
    </div>
  )
}

/* ─── Field wrapper ──────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-outline-variant uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-surface-container border border-surface-variant/50 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-colors placeholder:text-outline-variant'

/* ─── Modal ──────────────────────────────────────────── */
export function NuevaEmpresaModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]           = useState(1)
  const [empresa, setEmpresa]     = useState<EmpresaForm>(EMPTY_EMPRESA)
  const [po, setPO]               = useState<POForm>(EMPTY_PO)
  const [saving, setSaving]       = useState(false)
  const [done, setDone]           = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  /* ── Validation ── */
  function validateStep1() {
    const e: Record<string, string> = {}
    if (!empresa.nombre.trim())   e.nombre    = 'Requerido'
    if (!empresa.sector)          e.sector    = 'Selecciona un sector'
    if (!empresa.contacto.trim()) e.contacto  = 'Requerido'
    if (!empresa.email.trim())    e.email     = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) e.email = 'Email inválido'
    return e
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!po.nombre.trim()) e.po_nombre = 'Requerido'
    if (!po.email.trim())  e.po_email  = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(po.email)) e.po_email = 'Email inválido'
    return e
  }

  function nextStep() {
    const e = validateStep1()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  async function handleConfirm() {
    const e = validateStep2()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSaving(true)
    // Simulación — reemplazar con llamada real a Supabase
    await new Promise(r => setTimeout(r, 1400))
    setSaving(false)
    setDone(true)
  }

  function handleClose() {
    setStep(1); setEmpresa(EMPTY_EMPRESA); setPO(EMPTY_PO)
    setErrors({}); setDone(false)
    onClose()
  }

  const setE = (k: keyof EmpresaForm) => (v: string) => {
    setEmpresa(p => ({ ...p, [k]: v }))
    setErrors(prev => { const n = { ...prev }; delete n[k]; return n })
  }
  const setP = (k: keyof POForm, field: string) => (v: string) => {
    setPO(p => ({ ...p, [k]: v }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-md w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-variant/30 shrink-0">
          <div>
            <h2 className="text-base font-bold text-on-surface">
              {done ? 'Empresa creada' : 'Integrar nueva empresa'}
            </h2>
            {!done && (
              <p className="text-xs text-outline-variant mt-0.5">
                Paso {step} de 2 — {step === 1 ? 'Datos de la empresa' : 'Product Owner'}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="text-outline-variant hover:text-on-surface transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="px-6 pt-4 pb-2 flex items-center gap-2 shrink-0">
            <StepDot n={1} current={step} done={step > 1} />
            <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > 1 ? 'bg-secondary' : 'bg-surface-variant'}`} />
            <StepDot n={2} current={step} done={done} />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ─── SUCCESS ─── */}
          {done && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center">
                <CheckCircle2 size={32} className="text-on-secondary-fixed-variant" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{empresa.nombre}</h3>
                <p className="text-sm text-outline-variant mt-1">
                  Empresa integrada correctamente. El Product Owner <strong>{po.nombre}</strong> recibirá un correo de acceso.
                </p>
              </div>
              <div className="w-full bg-surface-container rounded-xl p-4 text-left space-y-1 text-sm">
                <p><span className="text-outline-variant">Sector:</span> <strong>{empresa.sector}</strong></p>
                <p><span className="text-outline-variant">Industria:</span> <strong>{empresa.industria || '—'}</strong></p>
                <p><span className="text-outline-variant">Contacto:</span> <strong>{empresa.contacto}</strong></p>
                <p><span className="text-outline-variant">PO asignado:</span> <strong>{po.nombre} ({po.email})</strong></p>
              </div>
            </div>
          )}

          {/* ─── STEP 1: Empresa ─── */}
          {!done && step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-secondary" />
                <span className="text-sm font-semibold text-on-surface-variant">Información de la empresa</span>
              </div>

              <Field label="Nombre de la empresa *">
                <input
                  className={`${inputCls} ${errors.nombre ? 'border-error' : ''}`}
                  placeholder="Ej. Constructora Aysén Ltda."
                  value={empresa.nombre}
                  onChange={e => setE('nombre')(e.target.value)}
                />
                {errors.nombre && <p className="text-xs text-error mt-1">{errors.nombre}</p>}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Sector *">
                  <select
                    className={`${inputCls} ${errors.sector ? 'border-error' : ''}`}
                    value={empresa.sector}
                    onChange={e => setE('sector')(e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.sector && <p className="text-xs text-error mt-1">{errors.sector}</p>}
                </Field>

                <Field label="Industria específica">
                  <input
                    className={inputCls}
                    placeholder="Ej. Salud digital"
                    value={empresa.industria}
                    onChange={e => setE('industria')(e.target.value)}
                  />
                </Field>
              </div>

              <div className="h-px bg-surface-variant/50 my-1" />
              <div className="flex items-center gap-2 mb-1">
                <User size={14} className="text-outline-variant" />
                <span className="text-xs font-semibold text-outline-variant uppercase tracking-wide">Contacto principal</span>
              </div>

              <Field label="Nombre del contacto *">
                <input
                  className={`${inputCls} ${errors.contacto ? 'border-error' : ''}`}
                  placeholder="Ej. Juan Pérez"
                  value={empresa.contacto}
                  onChange={e => setE('contacto')(e.target.value)}
                />
                {errors.contacto && <p className="text-xs text-error mt-1">{errors.contacto}</p>}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Email *">
                  <input
                    type="email"
                    className={`${inputCls} ${errors.email ? 'border-error' : ''}`}
                    placeholder="contacto@empresa.cl"
                    value={empresa.email}
                    onChange={e => setE('email')(e.target.value)}
                  />
                  {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                </Field>
                <Field label="Teléfono">
                  <input
                    className={inputCls}
                    placeholder="+56 9 1234 5678"
                    value={empresa.telefono}
                    onChange={e => setE('telefono')(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Product Owner ─── */}
          {!done && step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-secondary" />
                <span className="text-sm font-semibold text-on-surface-variant">Product Owner asignado</span>
              </div>
              <p className="text-xs text-outline-variant -mt-2">
                El PO recibirá acceso al panel y será responsable del proyecto en <strong>{empresa.nombre}</strong>.
              </p>

              <Field label="Nombre completo *">
                <input
                  className={`${inputCls} ${errors.po_nombre ? 'border-error' : ''}`}
                  placeholder="Ej. María González"
                  value={po.nombre}
                  onChange={e => setP('nombre', 'po_nombre')(e.target.value)}
                />
                {errors.po_nombre && <p className="text-xs text-error mt-1">{errors.po_nombre}</p>}
              </Field>

              <Field label="Email *">
                <input
                  type="email"
                  className={`${inputCls} ${errors.po_email ? 'border-error' : ''}`}
                  placeholder="po@empresa.cl"
                  value={po.email}
                  onChange={e => setP('email', 'po_email')(e.target.value)}
                />
                {errors.po_email && <p className="text-xs text-error mt-1">{errors.po_email}</p>}
              </Field>

              <Field label="Teléfono">
                <input
                  className={inputCls}
                  placeholder="+56 9 1234 5678"
                  value={po.telefono}
                  onChange={e => setP('telefono', 'po_telefono')(e.target.value)}
                />
              </Field>

              {/* Summary card */}
              <div className="bg-surface-container rounded-xl p-4 space-y-1 text-sm mt-2">
                <p className="text-xs font-semibold text-outline-variant uppercase tracking-wide mb-2">Resumen empresa</p>
                <p><span className="text-outline-variant">Nombre:</span> <strong>{empresa.nombre}</strong></p>
                <p><span className="text-outline-variant">Sector:</span> <strong>{empresa.sector}</strong>{empresa.industria && <span className="text-outline-variant"> · {empresa.industria}</span>}</p>
                <p><span className="text-outline-variant">Contacto:</span> <strong>{empresa.contacto}</strong> — {empresa.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-surface-variant/30 flex justify-between shrink-0">
          {done ? (
            <button
              onClick={handleClose}
              className="ml-auto px-5 py-2 text-sm font-semibold bg-gradient-to-r from-secondary to-primary text-on-primary rounded-lg shadow-ambient-sm hover:brightness-110 transition-all"
            >
              Cerrar
            </button>
          ) : (
            <>
              {step === 2 ? (
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border border-surface-variant/50 rounded-lg transition-colors"
                >
                  Atrás
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border border-surface-variant/50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-secondary to-primary text-on-primary rounded-lg shadow-ambient-sm hover:brightness-110 transition-all"
                >
                  Siguiente <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-secondary to-primary text-on-primary rounded-lg shadow-ambient-sm hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : 'Confirmar integración'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
