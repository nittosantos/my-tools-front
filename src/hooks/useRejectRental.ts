import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { Rental } from "@/types"

export function useRejectRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<Rental>(`/rentals/${id}/reject/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-rentals"] })
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] })
      toast.success("Aluguel rejeitado com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao rejeitar aluguel"
      toast.error(message)
    },
  })
}

