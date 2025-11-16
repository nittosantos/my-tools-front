import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import api from "@/lib/api"
import type { LoginCredentials, LoginResponse } from "@/types"
import { useAuth } from "./useAuth"

export function useLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<LoginResponse>("/auth/login/", credentials)
      return response.data
    },
    onSuccess: async (data) => {
      await login(data.access, data.user)
      toast.success("Login realizado com sucesso!")
      navigate({ to: "/dashboard/my-tools" })
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Erro ao fazer login"
      toast.error(message)
    },
  })
}

