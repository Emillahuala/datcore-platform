import { Badge } from '@/components/ui/Badge'
import { ROLE_LABELS } from '@/types/roles'
import type { Role } from '@/types/roles'

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return <Badge variant={role}>{ROLE_LABELS[role]}</Badge>
}
