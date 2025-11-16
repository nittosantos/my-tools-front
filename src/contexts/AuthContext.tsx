import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { User } from "@/types"
import api from "@/lib/api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData?: User) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Buscar dados do usuário
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const response = await api.get<User>("/auth/me/")
      setUser(response.data)
    } catch (error) {
      // Token inválido ou expirado
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (token: string, userData?: User) => {
    localStorage.setItem("token", token)
    if (userData) {
      setUser(userData)
    } else {
      await refreshUser()
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

