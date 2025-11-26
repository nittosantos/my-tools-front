import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Tool } from "@/types"
import { useAuth } from "./useAuth"

export function useMyTools() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const query = useQuery({
    queryKey: ["my-tools"],
    queryFn: async () => {
      const response = await api.get<Tool[]>("/tools/my/")
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

  // Garantir que data sempre seja um array, mesmo quando a API retornar null/undefined
  const data = Array.isArray(query.data) ? query.data : []

  return {
    ...query,
    data,
  }
}
