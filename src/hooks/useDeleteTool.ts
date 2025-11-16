import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"

export function useDeleteTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tools/${id}/`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tools"] })
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      toast.success("Ferramenta deletada com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao deletar ferramenta"
      toast.error(message)
    },
  })
}

