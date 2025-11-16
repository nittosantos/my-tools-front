import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const createToolSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  category: z.enum([
    "construcao",
    "jardinagem",
    "cozinha",
    "oficina_mecanica",
    "limpeza",
    "eletrica",
    "hidraulica",
    "pintura",
    "ferramentas_manuais",
    "ferramentas_eletricas",
    "automotiva",
    "eventos",
    "mudanca",
    "outros",
  ]),
  price_per_day: z
    .number()
    .positive("Preço deve ser positivo")
    .min(0.01, "Preço mínimo é R$ 0,01"),
  state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres (UF)"),
  city: z.string().min(1, "Cidade é obrigatória"),
  image: z.instanceof(File).optional().or(z.string().optional()),
})

export const updateToolSchema = createToolSchema.partial()

export const createRentalSchema = z.object({
  tool_id: z.number().positive(),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de fim é obrigatória"),
}).refine(
  (data) => {
    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    return end > start
  },
  {
    message: "Data de fim deve ser posterior à data de início",
    path: ["end_date"],
  }
).refine(
  (data) => {
    const start = new Date(data.start_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return start >= today
  },
  {
    message: "Não é possível alugar para datas passadas",
    path: ["start_date"],
  }
)

export type LoginFormData = z.infer<typeof loginSchema>
export type CreateToolFormData = z.infer<typeof createToolSchema>
export type UpdateToolFormData = z.infer<typeof updateToolSchema>
export type CreateRentalFormData = z.infer<typeof createRentalSchema>

