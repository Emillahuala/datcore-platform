'use client'

import { useEffect, useState } from 'react'
import { getDaysUntil, LEY_21719_DATE } from '@/lib/utils'

export function Countdown() {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    setDays(getDaysUntil(LEY_21719_DATE))
    const id = setInterval(() => setDays(getDaysUntil(LEY_21719_DATE)), 60_000)
    return () => clearInterval(id)
  }, [])

  if (days === null) return null

  const mono = { fontFamily: '"IBM Plex Mono", "Courier New", monospace' }

  return (
    <div className="inline-flex items-stretch gap-0 rounded-sm overflow-hidden border border-white/10">
      {/* Days counter block */}
      <div className="bg-secondary/20 px-4 py-3 flex flex-col items-center justify-center min-w-[72px]">
        <span
          className="text-3xl font-bold leading-none text-white tabular-nums"
          style={{ ...mono, color: '#2AADAD' }}
        >
          {days}
        </span>
        <span className="text-[0.55rem] uppercase tracking-[0.18em] text-white/40 mt-1" style={mono}>
          días
        </span>
      </div>

      {/* Separator */}
      <div className="w-px bg-white/10" />

      {/* Label block */}
      <div className="px-4 py-3 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-0.5">
          {/* Pulse dot */}
          <span
            className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
          />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/40" style={mono}>
            Vigencia Ley 21.719
          </span>
        </div>
        <span className="text-xs text-white/70" style={mono}>
          1 dic 2026
        </span>
      </div>
    </div>
  )
}
