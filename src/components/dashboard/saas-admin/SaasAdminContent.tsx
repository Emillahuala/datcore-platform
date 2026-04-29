'use client'

import { SaasMetricCards } from './SaasMetricCards'
import { ConsultorasTable } from './ConsultorasTable'

export function SaasAdminContent() {
  return (
    <div className="space-y-8 pb-12">
      <div className="animate-fade-up delay-100">
        <SaasMetricCards />
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient-sm lg:col-span-2 relative overflow-hidden group animate-fade-up delay-200">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <h3 className="text-xl font-bold tracking-tight text-primary mb-2 relative z-10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          Resumen de Facturación
        </h3>
        <p className="text-sm font-medium text-on-surface-variant relative z-10">
          Revisión general del estado de facturación por consultora para el periodo actual.
        </p>
        <div className="mt-4 border-l-2 border-secondary/30 pl-4 py-1">
          <p className="text-xs text-outline italic">
            El módulo detallado de facturación es accesible desde el menú izquierdo.
          </p>
        </div>
      </div>

      <div className="animate-fade-up delay-300">
        <ConsultorasTable />
      </div>
    </div>
  )
}
