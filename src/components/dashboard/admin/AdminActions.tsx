'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { NuevaEmpresaModal } from './NuevaEmpresaModal'

export function AdminActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-secondary to-primary text-on-primary font-medium text-sm px-6 py-3 rounded-md shadow-ambient hover:brightness-110 transition-all self-start md:self-auto flex items-center gap-2"
      >
        <Plus size={16} />
        Integrar empresa
      </button>

      {open && <NuevaEmpresaModal onClose={() => setOpen(false)} />}
    </>
  )
}
