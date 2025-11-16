import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

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

// Interceptor de response: trata erros 401 (logout automático)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só remover token e redirecionar em caso de 401 (não autorizado)
    // MAS não fazer isso para a rota de login - erros de login devem ser tratados pelo componente
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ""
      
      // Se for erro na rota de login, não fazer logout automático
      // Deixa o componente de login tratar o erro e mostrar o toast
      if (requestUrl.includes("/auth/login/")) {
        return Promise.reject(error)
      }
      
      // Para outros erros 401 (token inválido/expirado), fazer logout automático
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    // Para outros erros (404, 500, etc), apenas rejeitar a promise sem fazer nada
    return Promise.reject(error)
  }
)

export default api

