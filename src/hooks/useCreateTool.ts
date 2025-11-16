import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { CreateToolData, Tool } from "@/types"

export function useCreateTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateToolData) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("category", data.category)
      formData.append("price_per_day", data.price_per_day.toString())
      formData.append("state", data.state)
      formData.append("city", data.city)
      
      if (data.image instanceof File) {
        formData.append("image", data.image)
      }

      const response = await api.post<Tool>("/tools/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tools"] })
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      toast.success("Ferramenta criada com sucesso!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao criar ferramenta"
      toast.error(message)
    },
  })
}

