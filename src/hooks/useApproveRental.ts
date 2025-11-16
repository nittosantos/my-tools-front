import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { Rental } from "@/types"

export function useApproveRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<Rental>(`/rentals/${id}/approve/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-rentals"] })
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] })
      toast.success("Aluguel aprovado com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao aprovar aluguel"
      toast.error(message)
    },
  })
}

