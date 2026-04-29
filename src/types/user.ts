import type { Role } from './roles'

export interface UserMetadata {
  role: Role
  empresa_id: string
  nombre?: string
}

export interface AppUser {
  id: string
  email: string
  user_metadata: UserMetadata
}
