import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMyTools } from './useMyTools'
import * as api from '@/lib/api'
import * as useAuthModule from './useAuth'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0, // Não manter cache
        staleTime: 0, // Sempre considerar stale
      },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useMyTools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock padrão do useAuth
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, username: 'testuser', email: 'test@example.com' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    })
  })

  it('deve buscar lista de minhas ferramentas', async () => {
    const mockTools = [
      {
        id: 1,
        title: 'Minha Furadeira',
        description: 'Furadeira potente',
        category: 'ferramentas_eletricas' as const,
        price_per_day: 50,
        available: true,
        owner: 1,
      },
    ]

    vi.mocked(api.default.get).mockResolvedValue({ data: mockTools })

    const { result } = renderHook(() => useMyTools(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockTools)
    expect(api.default.get).toHaveBeenCalledWith('/tools/my/')
  })

  it('deve lidar com erro ao buscar minhas ferramentas', async () => {
    const error = new Error('Network error')
    vi.mocked(api.default.get).mockRejectedValue(error)

    const { result } = renderHook(() => useMyTools(), {
      wrapper: createWrapper(),
    })

    // Aguardar que a query seja executada e falhe (com retry: 1, pode demorar um pouco mais)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true)
      },
      { timeout: 5000 }
    )

    expect(result.current.error).toBeTruthy()
    // Verificar que a API foi chamada (pode ter sido chamada mais de uma vez devido ao retry)
    expect(api.default.get).toHaveBeenCalled()
  })
})

