export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}
