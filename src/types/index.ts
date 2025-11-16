// Tipos globais do sistema

export type Category = 
  | "construcao"
  | "jardinagem"
  | "cozinha"
  | "oficina_mecanica"
  | "limpeza"
  | "eletrica"
  | "hidraulica"
  | "pintura"
  | "ferramentas_manuais"
  | "ferramentas_eletricas"
  | "automotiva"
  | "eventos"
  | "mudanca"
  | "outros"

export type RentalStatus = 
  | "pending"
  | "approved"
  | "rejected"
  | "finished"

export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
}

export interface Tool {
  id: number
  title: string
  description: string
  category: Category
  price_per_day: number
  image_url?: string
  available: boolean
  state?: string | null
  city?: string | null
  owner: number // ID do usuário dono
  owner_username?: string // Para exibição
  created_at?: string
  updated_at?: string
}

export interface Rental {
  id: number
  tool: number // ID da ferramenta
  tool_details?: Tool // Dados completos da ferramenta (quando disponível)
  renter: number // ID do usuário que está alugando
  renter_username?: string // Para exibição
  start_date: string // ISO date string
  end_date: string // ISO date string
  total_price: number
  status: RentalStatus
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access: string // Token JWT
  refresh?: string
  user?: User
}

export interface CreateToolData {
  title: string
  description: string
  category: Category
  price_per_day: number
  state: string
  city: string
  image?: File | string // File para upload, string para URL existente
}

export interface UpdateToolData extends Partial<CreateToolData> {
  id: number
}

export interface CreateRentalData {
  tool_id: number
  start_date: string // ISO date string
  end_date: string // ISO date string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

