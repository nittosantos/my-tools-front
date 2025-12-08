import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMyRentals } from './useMyRentals'
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

describe('useMyRentals', () => {
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

  it('deve buscar lista de meus aluguéis', async () => {
    const mockRentals = [
      {
        id: 1,
        tool: 1,
        renter: 1,
        start_date: '2024-01-01',
        end_date: '2024-01-05',
        total_price: 200,
        status: 'pending' as const,
      },
    ]

    vi.mocked(api.default.get).mockResolvedValue({ data: mockRentals })

    const { result } = renderHook(() => useMyRentals(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockRentals)
    expect(api.default.get).toHaveBeenCalledWith('/rentals/my/')
  })

  it('deve lidar com erro ao buscar meus aluguéis', async () => {
    const error = new Error('Network error')
    vi.mocked(api.default.get).mockRejectedValue(error)

    const { result } = renderHook(() => useMyRentals(), {
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

