import axios, { AxiosError, type AxiosRequestConfig } from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Flag para evitar loops infinitos de refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor de request: adiciona token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de response: trata erros 401 (tenta refresh token)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Se for erro na rota de login ou refresh, não tentar refresh
    const requestUrl = originalRequest?.url || ""
    if (requestUrl?.includes("/auth/login/") || requestUrl?.includes("/auth/refresh/")) {
      return Promise.reject(error)
    }

    // Se for 401 e ainda não tentou refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está tentando refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem("refresh_token")

      if (!refreshToken) {
        // Não há refresh token, fazer logout
        processQueue(error, null)
        isRefreshing = false
        localStorage.removeItem("token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        // Tentar renovar o token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"}/auth/refresh/`,
          { refresh: refreshToken }
        )

        const { access } = response.data
        localStorage.setItem("token", access)

        // Atualizar header da requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }

        // Processar fila de requisições pendentes
        processQueue(null, access)
        isRefreshing = false

        // Retentar requisição original
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        processQueue(refreshError, null)
        isRefreshing = false
        localStorage.removeItem("token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Para outros erros, apenas rejeitar
    return Promise.reject(error)
  }
)

export default api
