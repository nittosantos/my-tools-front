import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLogin } from './useLogin'
import * as useAuth from './useAuth'
import * as api from '@/lib/api'
import { toast } from 'sonner'

// Mocks
vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(({ to }: { to: string }) => {}),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useLogin', () => {
  const mockLogin = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  it('deve fazer login com sucesso', async () => {
    const mockResponse = {
      data: {
        access: 'mock-token',
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      },
    }

    vi.mocked(api.default.post).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      username: 'testuser',
      password: 'password123',
    })

    await waitFor(() => {
      expect(api.default.post).toHaveBeenCalledWith('/auth/login/', {
        username: 'testuser',
        password: 'password123',
      })
      expect(mockLogin).toHaveBeenCalledWith('mock-token', mockResponse.data.user)
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!')
    })
  })

  it('deve mostrar erro ao falhar login', async () => {
    const mockError = {
      response: {
        data: {
          detail: 'Credenciais inválidas',
        },
      },
    }

    vi.mocked(api.default.post).mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      username: 'testuser',
      password: 'wrongpassword',
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas')
    })
  })
})

