import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('deve retornar usuário não autenticado inicialmente quando não há token', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('deve fazer login e atualizar estado', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }

    vi.mocked(api.default.get).mockResolvedValue({ data: mockUser })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login('mock-token', mockUser)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(localStorage.getItem('token')).toBe('mock-token')
  })

  it('deve fazer logout e limpar estado', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }

    localStorage.setItem('token', 'mock-token')

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login('mock-token', mockUser)
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })

  it('deve buscar dados do usuário quando há token no localStorage', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }

    localStorage.setItem('token', 'mock-token')
    vi.mocked(api.default.get).mockResolvedValue({ data: mockUser })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('deve lidar com erro ao buscar dados do usuário e limpar token', async () => {
    localStorage.setItem('token', 'invalid-token')
    vi.mocked(api.default.get).mockRejectedValue(new Error('Unauthorized'))

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Deve limpar token e usuário quando há erro (linhas 44-45)
    expect(result.current.user).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })

  it('deve lidar com refreshUser quando não há token', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Chamar refreshUser quando não há token (linhas 34-37)
    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.user).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  it('deve chamar refreshUser quando login não tem userData', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }

    vi.mocked(api.default.get).mockResolvedValue({ data: mockUser })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login('mock-token') // Sem userData (linha 56-57)
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    expect(api.default.get).toHaveBeenCalledWith('/auth/me/')
  })

  it('deve lançar erro quando useAuth é usado fora do AuthProvider', () => {
    // Suprimir console.error para não poluir o output do teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})

