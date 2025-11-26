import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Rental } from "@/types"
import { useAuth } from "./useAuth"

export function useReceivedRentals() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const query = useQuery({
    queryKey: ["received-rentals"],
    queryFn: async () => {
      const response = await api.get<Rental[]>("/rentals/received/")
      return response.data
    },
    // Só fazer a requisição se estiver autenticado e não estiver carregando autenticação
    enabled: isAuthenticated && !isAuthLoading,
    retry: 1,
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
