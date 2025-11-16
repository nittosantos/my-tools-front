import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { User } from "@/types"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<User>("/auth/me/")
      return response.data
    },
    retry: false,
  })
}

