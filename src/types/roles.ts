export const ROLES = {
  ADMIN:          'admin',
  PRODUCT_OWNER:  'product_owner',
  ENCARGADO_AREA: 'encargado_area',
  EJECUTIVO:      'ejecutivo',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  admin:          '/admin',
  product_owner:  '/product-owner',
  encargado_area: '/encargado',
  ejecutivo:      '/ejecutivo',
}

export const ROLE_LABELS: Record<Role, string> = {
  admin:          'Administrador',
  product_owner:  'Product Owner',
  encargado_area: 'Encargado de Área',
  ejecutivo:      'Ejecutivo',
}

export const ESTADOS_PROYECTO = ['Iniciado', 'En diagnóstico', 'En remediación', 'Completado'] as const
export type EstadoProyecto = typeof ESTADOS_PROYECTO[number]
