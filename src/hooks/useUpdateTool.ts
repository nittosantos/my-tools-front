import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { UpdateToolData, Tool } from "@/types"

export function useUpdateTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateToolData) => {
      const { id, ...updateData } = data
      const response = await api.patch<Tool>(`/tools/${id}/`, updateData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tools"] })
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      toast.success("Ferramenta atualizada com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao atualizar ferramenta"
      toast.error(message)
    },
  })
}

