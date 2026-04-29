'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Check, Save,
  Upload, X, FileText, AlertTriangle, Loader2,
} from 'lucide-react'
import type { CuestionarioData, PreguntaReal, OpcionRespuesta } from '@/types/cuestionario'
import type { AppUser } from '@/types/user'
import { createClient } from '@/lib/supabase/client'

interface Props {
  cuestionario: CuestionarioData
  user: AppUser
}

const PREGUNTAS_POR_PAGINA = 4

export function FormularioWizardReal({ cuestionario, user }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>(
    cuestionario.respuestas_guardadas
  )
  const [archivo, setArchivo] = useState<File | null>(null)
  const [archivoPath, setArchivoPath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [declaracion, setDeclaracion] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const nombre = user.user_metadata?.nombre ?? user.email

  // Agrupar preguntas en páginas de 4
  const grupos: PreguntaReal[][] = []
  for (let i = 0; i < cuestionario.preguntas.length; i += PREGUNTAS_POR_PAGINA) {
    grupos.push(cuestionario.preguntas.slice(i, i + PREGUNTAS_POR_PAGINA))
  }

  const totalPaginasPreguntas = grupos.length
  const totalPaginas = totalPaginasPreguntas + 1 // +1 página de adjuntos
  const isAdjuntosPage = currentPage === totalPaginasPreguntas
  const isFirstPage = currentPage === 0
  const progressPct = Math.round(((currentPage + 1) / totalPaginas) * 100)
  const preguntasActuales = isAdjuntosPage ? [] : (grupos[currentPage] ?? [])

  const totalRespondidas = Object.keys(answers).length
  const totalPreguntas = cuestionario.preguntas.length
  const allAnswered = totalRespondidas >= totalPreguntas

  // Preguntas de la página actual sin responder
  const currentPageUnanswered = preguntasActuales.filter(
    p => answers[p.id_cat_pregunta] === undefined
  )
  const currentPageComplete = currentPageUnanswered.length === 0
  const [showPageError, setShowPageError] = useState(false)

  function handleAnswer(id_cat_pregunta: number, id_cat_respuesta: number) {
    setAnswers(prev => ({ ...prev, [id_cat_pregunta]: id_cat_respuesta }))
    setDraftSaved(false)
    setShowPageError(false)
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  function next() {
    if (!currentPageComplete) { setShowPageError(true); return }
    setShowPageError(false)
    setCurrentPage(p => p + 1)
    scrollTop()
  }
  function prev() { setShowPageError(false); setCurrentPage(p => p - 1); scrollTop() }

  // ── Upload archivo
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setArchivo(file)
    setUploading(true)
    setError(null)

    const supabase = createClient()
    const path = `${user.id}/${cuestionario.id_area}/${Date.now()}_${file.name}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: uploadError } = await (supabase.storage as any)
      .from('adjuntos-cuestionario')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Error al subir el archivo. Intenta de nuevo.')
      setArchivo(null)
      setArchivoPath(null)
    } else {
      setArchivoPath(path)
    }
    setUploading(false)
  }

  function removeFile() {
    setArchivo(null)
    setArchivoPath(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Guardar borrador
  async function handleSaveDraft() {
    if (savingDraft || Object.keys(answers).length === 0) return
    setSavingDraft(true)
    setError(null)

    const res = await fetch(`/api/encargado/cuestionario/${cuestionario.id_area}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        respuestas: buildRespuestasArray(),
        declaracion_veracidad: false,
        borrador: true,
      }),
    })

    setSavingDraft(false)
    if (res.ok) {
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    } else {
      setError('No se pudo guardar el borrador.')
    }
  }

  function buildRespuestasArray() {
    return Object.entries(answers).map(([pregunta, respuesta]) => ({
      id_cat_pregunta: parseInt(pregunta),
      id_cat_respuesta: respuesta,
    }))
  }

  // ── Envío final
  async function handleSubmit() {
    if (!declaracion || submitting) return
    setSubmitting(true)
    setError(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Record<string, any> = {
      respuestas: buildRespuestasArray(),
      declaracion_veracidad: true,
      borrador: false,
    }

    if (archivoPath && archivo) {
      body.archivo = {
        nombre:     archivo.name,
        url:        archivoPath,
        size_bytes: archivo.size,
        mime_type:  archivo.type,
      }
    }

    const res = await fetch(`/api/encargado/cuestionario/${cuestionario.id_area}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al enviar. Intenta de nuevo.')
      setSubmitting(false)
      return
    }

    setShowModal(false)
    setSubmitted(true)
  }

  /* ══════════════════════════════════════════════════
     Estado de éxito
  ══════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
          <Check size={32} className="text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Cuestionario enviado</h2>
        <p className="text-sm text-on-surface-variant mb-1 max-w-sm">
          Las respuestas del área{' '}
          <span className="font-semibold text-on-surface">{cuestionario.nombre_area}</span>{' '}
          fueron registradas correctamente.
        </p>
        <p className="text-xs text-on-surface-variant mb-8 max-w-sm">
          El Product Owner ha sido notificado y revisará la información enviada.
        </p>
        <Link
          href="/encargado"
          className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-on-primary text-sm font-bold rounded-lg shadow-ambient hover:brightness-110 transition-all"
        >
          Volver a mis cuestionarios
        </Link>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════
     Wizard
  ══════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 h-16 bg-surface-container-low/80 backdrop-blur-sm border-b border-outline-variant/15">
        <Link
          href="/encargado"
          className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft size={15} />
          Mis cuestionarios
        </Link>
        <div className="flex items-center gap-4">
          {/* Guardar borrador */}
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft || Object.keys(answers).length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingDraft
              ? <Loader2 size={12} className="animate-spin" />
              : draftSaved
                ? <Check size={12} className="text-secondary" />
                : <Save size={12} />}
            {draftSaved ? 'Guardado' : 'Guardar borrador'}
          </button>

          <span className="text-xs text-on-surface-variant">
            Paso <span className="font-bold text-on-surface">{currentPage + 1}</span>{' '}
            de {totalPaginas}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold select-none">
            {nombre.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Barra de progreso */}
      <div className="w-full h-1 bg-surface-variant">
        <div
          className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Contenido principal */}
      <main className="flex-1 px-6 md:px-8 py-10 max-w-2xl mx-auto w-full">

        {/* Encabezado de sección */}
        <div className="mb-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {cuestionario.nombre_area}
            {!isAdjuntosPage && (
              <> · Preguntas{' '}
                {currentPage * PREGUNTAS_POR_PAGINA + 1}–
                {Math.min((currentPage + 1) * PREGUNTAS_POR_PAGINA, totalPreguntas)}
                {' '}de {totalPreguntas}</>
            )}
            {isAdjuntosPage && ' · Documentación'}
          </p>
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            {isAdjuntosPage ? 'Adjunta documentación de respaldo' : 'Diagnóstico de cumplimiento'}
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            {isAdjuntosPage
              ? 'Puedes adjuntar un archivo de respaldo (opcional). No afecta el puntaje del diagnóstico.'
              : 'Selecciona la opción que mejor describe la situación actual de tu área frente a la Ley 21.719.'}
          </p>
        </div>

        {/* ── Página de preguntas */}
        {!isAdjuntosPage && (
          <div className="space-y-5">
            {preguntasActuales.map((pregunta, idx) => (
              <PreguntaCard
                key={pregunta.id_cat_pregunta}
                pregunta={pregunta}
                globalIndex={currentPage * PREGUNTAS_POR_PAGINA + idx + 1}
                totalPreguntas={totalPreguntas}
                selectedRespuesta={answers[pregunta.id_cat_pregunta]}
                highlight={showPageError && answers[pregunta.id_cat_pregunta] === undefined}
                onAnswer={(id_resp) => handleAnswer(pregunta.id_cat_pregunta, id_resp)}
              />
            ))}

            {/* Aviso de preguntas pendientes en la página */}
            {showPageError && currentPageUnanswered.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-error/5 border border-error/20 rounded-lg">
                <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                <p className="text-xs text-error">
                  {currentPageUnanswered.length === 1
                    ? 'Falta responder 1 pregunta antes de continuar.'
                    : `Faltan ${currentPageUnanswered.length} preguntas por responder antes de continuar.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Página de adjuntos */}
        {isAdjuntosPage && (
          <div className="space-y-6">

            {/* Resumen de respuestas */}
            <div className={`rounded-xl p-4 border flex items-center gap-3 ${
              allAnswered
                ? 'bg-[#e8f5e9] border-[#a5d6a7]'
                : 'bg-error/5 border-error/25'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                allAnswered ? 'bg-[#2e7d32]/15' : 'bg-error/10'
              }`}>
                {allAnswered
                  ? <Check size={16} className="text-[#2e7d32]" />
                  : <AlertTriangle size={16} className="text-error" />
                }
              </div>
              <div>
                <p className={`text-sm font-bold ${allAnswered ? 'text-on-surface' : 'text-error'}`}>
                  {allAnswered
                    ? 'Todas las preguntas respondidas'
                    : `Faltan ${totalPreguntas - totalRespondidas} de ${totalPreguntas} preguntas`}
                </p>
                {!allAnswered && (
                  <p className="text-xs text-error/80 mt-0.5">
                    Debes completar todas las preguntas para poder enviar el cuestionario.
                  </p>
                )}
              </div>
            </div>

            {/* Uploader */}
            <div>
              <p className="text-sm font-semibold text-on-surface mb-3">
                Archivo de respaldo
                <span className="ml-1.5 text-xs font-normal text-on-surface-variant">(opcional)</span>
              </p>

              {!archivo ? (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline-variant/40 rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors group">
                  <Upload size={22} className="text-outline group-hover:text-secondary transition-colors mb-2" />
                  <span className="text-sm text-on-surface-variant">Haz clic para seleccionar</span>
                  <span className="text-xs text-outline mt-1">PDF, Word, Excel, imágenes · Máx 10 MB</span>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/20">
                  {uploading
                    ? <Loader2 size={20} className="text-secondary animate-spin shrink-0" />
                    : <FileText size={20} className="text-secondary shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{archivo.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {uploading
                        ? 'Subiendo...'
                        : `${(archivo.size / 1024).toFixed(0)} KB · Listo para enviar`}
                    </p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={removeFile}
                      className="shrink-0 p-1 text-outline hover:text-error transition-colors rounded"
                      title="Eliminar archivo"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-error/5 border border-error/20 rounded-lg">
                <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                <p className="text-xs text-error">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Navegación */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-outline-variant/20">
          <button
            onClick={prev}
            disabled={isFirstPage}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
            Anterior
          </button>

          {isAdjuntosPage ? (
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => { setError(null); setShowModal(true) }}
                disabled={uploading || !allAnswered}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-on-primary bg-gradient-to-r from-secondary to-primary rounded-lg shadow-ambient hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check size={15} />
                Enviar cuestionario
              </button>
              {!allAnswered && (
                <p className="text-[0.65rem] text-error">
                  Completa todas las preguntas para enviar
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-on-primary bg-gradient-to-r from-secondary to-primary rounded-lg shadow-ambient hover:brightness-110 transition-all"
            >
              Siguiente
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          Modal de confirmación
      ══════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6">

            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Check size={24} className="text-secondary" />
            </div>

            <h3 className="text-lg font-bold text-on-surface mb-1">
              Confirmar envío
            </h3>
            <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
              Estás a punto de enviar el diagnóstico del área{' '}
              <span className="font-semibold text-on-surface">{cuestionario.nombre_area}</span>.
              El Product Owner recibirá una notificación de inmediato.
            </p>

            {/* Checkbox de responsabilidad */}
            <button
              type="button"
              onClick={() => setDeclaracion(d => !d)}
              className="flex items-start gap-3 w-full p-4 rounded-xl bg-surface-container border border-outline-variant/20 hover:border-secondary/40 transition-colors text-left mb-5"
            >
              <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                declaracion ? 'border-secondary bg-secondary' : 'border-outline-variant'
              }`}>
                {declaracion && <Check size={10} className="text-white" />}
              </div>
              <span className="text-xs text-on-surface leading-relaxed">
                Declaro que la información proporcionada es verídica y completa, y asumo la
                responsabilidad por su contenido en el marco de la Ley 21.719 de Protección
                de Datos Personales.
              </span>
            </button>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-error/5 border border-error/20 rounded-lg mb-4">
                <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                <p className="text-xs text-error">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setError(null) }}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-on-surface-variant bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!declaracion || submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-on-primary bg-gradient-to-r from-secondary to-primary rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Enviando...</>
                  : <><Check size={14} /> Confirmar y enviar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════
   Sub-componente: card de una pregunta
══════════════════════════════════════════════════ */
function PreguntaCard({
  pregunta,
  globalIndex,
  totalPreguntas,
  selectedRespuesta,
  highlight,
  onAnswer,
}: {
  pregunta: PreguntaReal
  globalIndex: number
  totalPreguntas: number
  selectedRespuesta: number | undefined
  highlight: boolean
  onAnswer: (id: number) => void
}) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl border p-5 transition-all ${
      highlight
        ? 'border-error/50 shadow-[0_0_0_3px_rgba(186,26,26,0.08)]'
        : 'border-outline-variant/20 hover:shadow-ambient-sm'
    }`}>
      {/* Enunciado */}
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 mt-0.5 text-[0.6rem] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded tabular-nums">
          {globalIndex}/{totalPreguntas}
        </span>
        <div>
          <p className="text-sm font-semibold text-on-surface leading-snug">
            {pregunta.enunciado}
          </p>
          <p className="text-[0.6rem] uppercase tracking-widest text-on-surface-variant mt-1">
            {pregunta.codigo_pregunta}
          </p>
        </div>
      </div>

      {/* Opciones */}
      <div className="space-y-2">
        {pregunta.opciones.map((opcion: OpcionRespuesta) => {
          const selected = selectedRespuesta === opcion.id_cat_respuesta
          return (
            <button
              key={opcion.id_cat_respuesta}
              onClick={() => onAnswer(opcion.id_cat_respuesta)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left border transition-all ${
                selected
                  ? 'bg-secondary/8 border-secondary/50 shadow-ambient-sm'
                  : 'bg-surface-container-low border-transparent hover:bg-surface-container hover:border-outline-variant/30'
              }`}
            >
              {/* Letra de opción */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[0.6rem] font-bold transition-all ${
                selected
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-outline-variant text-on-surface-variant'
              }`}>
                {opcion.letra}
              </div>

              <span className={`text-sm leading-snug flex-1 ${
                selected ? 'text-on-surface font-medium' : 'text-on-surface-variant'
              }`}>
                {opcion.texto}
              </span>

              {selected && (
                <Check size={14} className="ml-auto text-secondary shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
