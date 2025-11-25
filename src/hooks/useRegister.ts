import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import api from "@/lib/api"
import type { RegisterFormData } from "@/lib/schemas"
import type { LoginResponse } from "@/types"
import { useAuth } from "./useAuth"

interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export function useRegister() {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Remover password_confirm antes de enviar e limpar campos vazios
      const { password_confirm, ...registerData } = data
      const payload: RegisterData = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      }
      // Adicionar first_name e last_name apenas se não estiverem vazios
      if (registerData.first_name?.trim()) {
        payload.first_name = registerData.first_name.trim()
      }
      if (registerData.last_name?.trim()) {
        payload.last_name = registerData.last_name.trim()
      }
      const response = await api.post<LoginResponse>("/auth/register/", payload)
      return response.data
    },
    onSuccess: async (data) => {
      await login(data.access, data.refresh, data.user)
      toast.success("Conta criada com sucesso!")
      navigate({ to: "/dashboard/my-tools" })
    },
    onError: (error: any) => {
      // Tratar diferentes tipos de erro do backend
      let message = "Erro ao criar conta"
      
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Se for um objeto com campos específicos (Django REST Framework)
        if (typeof errorData === 'object' && !errorData.detail) {
          const firstError = Object.values(errorData)[0]
          if (Array.isArray(firstError)) {
            message = firstError[0] as string
          } else if (typeof firstError === 'string') {
            message = firstError
          }
        } else if (errorData.detail) {
          message = errorData.detail
        } else if (typeof errorData === 'string') {
          message = errorData
        }
      }
      
      toast.error(message)
    },
  })
}

