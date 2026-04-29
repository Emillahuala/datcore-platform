export const ROLES = {
  ADMIN:          'admin',
  PRODUCT_OWNER:  'product_owner',
  ENCARGADO_AREA: 'encargado_area',
  EJECUTIVO:      'ejecutivo',
  SAAS_ADMIN:     'saas_admin',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_DEFAULT_ROUTES: Record<Role, string> = {
  admin:          '/admin',
  product_owner:  '/product-owner',
  encargado_area: '/encargado',
  ejecutivo:      '/ejecutivo',
  saas_admin:     '/saas-admin',
}

export const ROLE_LABELS: Record<Role, string> = {
  admin:          'Administrador',
  product_owner:  'Product Owner',
  encargado_area: 'Encargado de Área',
  ejecutivo:      'Ejecutivo',
  saas_admin:     'Administrador SaaS',
}

export const ESTADOS_PROYECTO = ['Iniciado', 'En diagnóstico', 'En remediación', 'Completado'] as const
export type EstadoProyecto = typeof ESTADOS_PROYECTO[number]
