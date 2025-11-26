import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Tool, PaginatedResponse } from "@/types"
import { useAuth } from "./useAuth"

export function useMyTools() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const query = useQuery({
    queryKey: ["my-tools"],
    queryFn: async () => {
      const response = await api.get<Tool[] | PaginatedResponse<Tool>>("/tools/my/")
      return response.data
    },
    // Só fazer a requisição se estiver autenticado e não estiver carregando autenticação
    enabled: isAuthenticated && !isAuthLoading,
    // Retry apenas 1 vez em caso de erro
    retry: 1,
    // Não refazer a requisição automaticamente ao focar na janela
    refetchOnWindowFocus: false,
    // Manter dados em cache mesmo após erro para não quebrar na navegação
    placeholderData: (previousData) => previousData,
  })

  // Se a resposta for paginada, extrair o array de results
  // Se for array direto, usar como está
  let data: Tool[] = []
  
  if (query.data) {
    if (Array.isArray(query.data)) {
      // Formato antigo: array direto
      data = query.data
    } else if ("results" in query.data) {
      // Formato novo: objeto paginado
      data = query.data.results
    }
  }

  return {
    ...query,
    data,
  }
}
