'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react'
import type { FormularioData, Pregunta } from '@/lib/formularios-data'
import type { AppUser } from '@/types/user'

interface Props {
  formulario: FormularioData
  user: AppUser
}

type Answers = Record<string, string | string[]>

export function FormularioWizard({ formulario, user }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  const secciones = formulario.secciones
  const seccion = secciones[currentPage]
  const totalPages = secciones.length
  const isFirst = currentPage === 0
  const isLast = currentPage === totalPages - 1
  const progressPct = Math.round(((currentPage + 1) / totalPages) * 100)
  const nombre = user.user_metadata?.nombre ?? user.email

  function handleAnswer(id: string, value: string, tipo: string) {
    if (tipo === 'checkbox') {
      const prev = (answers[id] as string[]) ?? []
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      setAnswers(a => ({ ...a, [id]: next }))
    } else {
      setAnswers(a => ({ ...a, [id]: value }))
    }
  }

  function next() {
    if (isLast) { setSubmitted(true); return }
    setCurrentPage(p => p + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function prev() {
    setCurrentPage(p => p - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
          <Check size={32} className="text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Formulario enviado</h2>
        <p className="text-sm text-on-surface-variant mb-8 max-w-sm">
          Tus respuestas han sido guardadas. El Product Owner revisará la información enviada.
        </p>
        <Link
          href="/encargado"
          className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-on-primary text-sm font-bold rounded-md shadow-ambient hover:brightness-110 transition-all"
        >
          Volver a mis formularios
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 h-16 bg-surface-container-low/80 backdrop-blur-sm border-b border-outline-variant/15">
        <Link
          href="/encargado"
          className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft size={15} />
          Mis formularios
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant">
            Sección <span className="font-bold text-on-surface">{currentPage + 1}</span> de {totalPages}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold select-none">
            {nombre.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="w-full h-1 bg-surface-variant">
        <div
          className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Form content ── */}
      <main className="flex-1 px-6 md:px-8 py-10 max-w-2xl mx-auto w-full">

        {/* Section header */}
        <div className="mb-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {formulario.titulo}
          </p>
          <h2 className="text-2xl font-bold text-primary tracking-tight">{seccion.titulo}</h2>
          {seccion.descripcion && (
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{seccion.descripcion}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {seccion.preguntas.map((pregunta, idx) => (
            <Question
              key={pregunta.id}
              pregunta={pregunta}
              index={idx + 1}
              value={answers[pregunta.id]}
              onChange={(val) => handleAnswer(pregunta.id, val, pregunta.tipo)}
            />
          ))}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-outline-variant/20">
          <button
            onClick={prev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-on-surface-variant bg-surface-container hover:bg-surface-container-high rounded-md transition-colors">
              <Save size={14} />
              Guardar borrador
            </button>
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-on-primary bg-gradient-to-r from-secondary to-primary rounded-md shadow-ambient hover:brightness-110 transition-all"
            >
              {isLast ? 'Enviar formulario' : 'Siguiente'}
              {isLast ? <Check size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

/* ── Individual question renderer ── */
function Question({
  pregunta,
  index,
  value,
  onChange,
}: {
  pregunta: Pregunta
  index: number
  value: string | string[] | undefined
  onChange: (val: string) => void
}) {
  const inputBase =
    'w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-secondary focus:ring-0 text-sm text-on-surface py-2.5 px-1 transition-colors outline-none'

  return (
    <div>
      {/* Label */}
      <div className="mb-3">
        <label className="text-sm font-semibold text-on-surface leading-snug">
          <span className="text-xs font-bold text-on-surface-variant mr-2">{index}.</span>
          {pregunta.texto}
          {pregunta.requerida && <span className="text-error ml-1 font-normal">*</span>}
        </label>
        {pregunta.ayuda && (
          <p className="text-xs text-on-surface-variant mt-1 ml-5">{pregunta.ayuda}</p>
        )}
      </div>

      {/* text */}
      {pregunta.tipo === 'text' && (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className={inputBase}
        />
      )}

      {/* textarea */}
      {pregunta.tipo === 'textarea' && (
        <textarea
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={4}
          placeholder="Escribe tu respuesta..."
          className={`${inputBase} resize-none`}
        />
      )}

      {/* select */}
      {pregunta.tipo === 'select' && pregunta.opciones && (
        <select
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} cursor-pointer`}
        >
          <option value="">Selecciona una opción...</option>
          {pregunta.opciones.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      )}

      {/* radio */}
      {pregunta.tipo === 'radio' && pregunta.opciones && (
        <div className="space-y-2">
          {pregunta.opciones.map(opcion => {
            const selected = value === opcion
            return (
              <label
                key={opcion}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                  selected
                    ? 'bg-secondary/5 border-secondary/40'
                    : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected ? 'border-secondary' : 'border-outline-variant'
                }`}>
                  {selected && <div className="w-2 h-2 rounded-full bg-secondary" />}
                </div>
                <span className="text-sm text-on-surface">{opcion}</span>
                <input type="radio" className="sr-only" checked={selected} onChange={() => onChange(opcion)} />
              </label>
            )
          })}
        </div>
      )}

      {/* checkbox */}
      {pregunta.tipo === 'checkbox' && pregunta.opciones && (
        <div className="space-y-2">
          {pregunta.opciones.map(opcion => {
            const checked = ((value as string[]) ?? []).includes(opcion)
            return (
              <label
                key={opcion}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                  checked
                    ? 'bg-secondary/5 border-secondary/40'
                    : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  checked ? 'border-secondary bg-secondary' : 'border-outline-variant bg-transparent'
                }`}>
                  {checked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-sm text-on-surface">{opcion}</span>
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => onChange(opcion)} />
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
