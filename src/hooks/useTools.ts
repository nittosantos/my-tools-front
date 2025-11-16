import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Tool, Category, PaginatedResponse } from "@/types"

interface UseToolsOptions {
  categories?: Category[]
  state?: string
  cities?: string[]
  search?: string
  ordering?: string
  page?: number
}

interface UseToolsReturn {
  data: Tool[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
  pagination?: {
    count: number
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export function useTools(options?: UseToolsOptions): UseToolsReturn {
  const { categories = [], state, cities = [], search, ordering, page = 1 } = options || {}

  const query = useQuery({
    queryKey: ["tools", ...categories.sort(), state, ...cities.sort(), search, ordering, page], // Incluir filtros, busca, ordenação e página na queryKey
    queryFn: async () => {
      const params = new URLSearchParams()
      categories.forEach((category) => {
        params.append("category", category)
      })
      if (state) {
        params.append("state", state)
      }
      cities.forEach((city) => {
        params.append("city", city)
      })
      if (search) {
        params.append("search", search)
      }
      if (ordering) {
        params.append("ordering", ordering)
      }
      params.append("page", page.toString())

      const url = `/tools/?${params.toString()}`
      const response = await api.get<PaginatedResponse<Tool>>(url)
      return response.data
    },
  })

  // Se a resposta não tiver paginação (formato antigo), retornar como array
  if (query.data && !("count" in query.data)) {
    return {
      data: query.data as unknown as Tool[],
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
    }
  }

  const paginatedData = query.data as PaginatedResponse<Tool> | undefined

  // Calcular informações de paginação
  const count = paginatedData?.count || 0
  const pageSize = 9 // PAGE_SIZE do backend (9 itens = 3 linhas x 3 colunas)
  const totalPages = Math.ceil(count / pageSize)
  const hasNext = !!paginatedData?.next
  const hasPrevious = !!paginatedData?.previous

  // Extrair número da página da URL next/previous
  const getPageFromUrl = (url: string | null): number | null => {
    if (!url) return null
    const match = url.match(/[?&]page=(\d+)/)
    return match ? parseInt(match[1], 10) : null
  }

  return {
    data: paginatedData?.results,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    pagination: {
      count,
      currentPage: page,
      totalPages,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : null,
      previousPage: hasPrevious ? page - 1 : null,
    },
  }
}

