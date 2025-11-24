import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { Rental } from "@/types"

export function useFinishRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<Rental>(`/rentals/${id}/finish/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["received-rentals"] })
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] })
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      toast.success("Aluguel finalizado com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao finalizar aluguel"
      toast.error(message)
    },
  })
}

