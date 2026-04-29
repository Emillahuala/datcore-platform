import { RoleBadge } from './RoleBadge'
import type { AppUser } from '@/types/user'

interface NavbarProps {
  user: AppUser
  title: string
}

export function Navbar({ user, title }: NavbarProps) {
  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      <div className="flex items-center gap-3">
        <RoleBadge role={user.user_metadata.role} />
        <span className="text-sm text-neutral-600">
          {user.user_metadata.nombre ?? user.email}
        </span>
      </div>
    </header>
  )
}
