import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Tool } from "@/types"

export function useTool(id: number) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const response = await api.get<Tool>(`/tools/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

