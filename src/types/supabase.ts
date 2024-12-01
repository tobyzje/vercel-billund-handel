export type UserRole = 'user' | 'admin' | 'webmaster'

export interface UserMetadata {
  name: string
  role: UserRole
} 