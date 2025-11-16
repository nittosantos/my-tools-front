import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import api from "@/lib/api"
import type { CreateRentalData, Rental } from "@/types"

export function useCreateRental() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: CreateRentalData) => {
      const response = await api.post<Rental>("/rentals/", {
        tool_id: data.tool_id,
        start_date: data.start_date,
        end_date: data.end_date,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] })
      queryClient.invalidateQueries({ queryKey: ["received-rentals"] })
      toast.success("Aluguel criado com sucesso!")
      navigate({ to: "/dashboard/my-rentals" })
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao criar aluguel"
      toast.error(message)
    },
  })
}

