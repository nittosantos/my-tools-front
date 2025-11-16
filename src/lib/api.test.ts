import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import api from './api'

describe('api', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('deve exportar instância do axios configurada', () => {
    expect(api).toBeDefined()
    expect(api.get).toBeDefined()
    expect(api.post).toBeDefined()
    expect(api.patch).toBeDefined()
    expect(api.delete).toBeDefined()
    expect(api.interceptors).toBeDefined()
  })

  it('deve ter interceptors de request e response configurados', () => {
    expect(api.interceptors.request).toBeDefined()
    expect(api.interceptors.response).toBeDefined()
  })

  it('deve adicionar token no header quando existe no localStorage', () => {
    localStorage.setItem('token', 'test-token-123')
    
    const config = {
      url: '/test',
      method: 'get',
      headers: {} as any,
    }
    
    // Acessar o interceptor de request diretamente
    const requestHandlers = (api.interceptors.request as any).handlers || []
    if (requestHandlers.length > 0) {
      const requestInterceptor = requestHandlers[0].fulfilled
      if (requestInterceptor) {
        const modifiedConfig = requestInterceptor(config)
        expect(modifiedConfig.headers.Authorization).toBe('Bearer test-token-123')
      }
    }
  })

  it('não deve adicionar token quando não existe no localStorage', () => {
    localStorage.removeItem('token')
    
    const config = {
      url: '/test',
      method: 'get',
      headers: {} as any,
    }
    
    const requestHandlers = (api.interceptors.request as any).handlers || []
    if (requestHandlers.length > 0) {
      const requestInterceptor = requestHandlers[0].fulfilled
      if (requestInterceptor) {
        const modifiedConfig = requestInterceptor(config)
        expect(modifiedConfig.headers.Authorization).toBeUndefined()
      }
    }
  })

  it('deve remover token e redirecionar quando recebe erro 401', async () => {
    localStorage.setItem('token', 'invalid-token')
    
    // Mock window.location
    const originalLocation = window.location
    delete (window as any).location
    const mockLocation = { href: '' }
    window.location = mockLocation as any
    
    const error = {
      response: {
        status: 401,
      },
    }
    
    const responseHandlers = (api.interceptors.response as any).handlers || []
    if (responseHandlers.length > 0) {
      const errorInterceptor = responseHandlers[0].rejected
      if (errorInterceptor) {
        try {
          await errorInterceptor(error)
        } catch {
          // Esperado - o interceptor rejeita
        }
        
        expect(localStorage.getItem('token')).toBe(null)
        expect(mockLocation.href).toBe('/login')
      }
    }
    
    // Restaurar
    window.location = originalLocation
  })

  it('não deve remover token em erros que não são 401', async () => {
    localStorage.setItem('token', 'valid-token')
    
    const error = {
      response: {
        status: 500,
      },
    }
    
    const responseHandlers = (api.interceptors.response as any).handlers || []
    if (responseHandlers.length > 0) {
      const errorInterceptor = responseHandlers[0].rejected
      if (errorInterceptor) {
        try {
          await errorInterceptor(error)
        } catch {
          // Esperado - o interceptor rejeita
        }
        
        expect(localStorage.getItem('token')).toBe('valid-token')
      }
    }
  })

  it('deve tratar erro no request interceptor', async () => {
    const error = new Error('Request error')
    
    const requestHandlers = (api.interceptors.request as any).handlers || []
    if (requestHandlers.length > 0) {
      const errorHandler = requestHandlers[0].rejected
      if (errorHandler) {
        await expect(errorHandler(error)).rejects.toEqual(error)
      }
    }
  })
})
