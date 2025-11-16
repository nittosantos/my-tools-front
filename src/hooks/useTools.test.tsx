import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTools } from './useTools'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
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

describe('useTools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar lista de ferramentas', async () => {
    const mockTools = [
      {
        id: 1,
        title: 'Furadeira',
        description: 'Furadeira potente',
        category: 'ferramentas_eletricas' as const,
        price_per_day: 50,
        available: true,
        owner: 1,
      },
    ]

    vi.mocked(api.default.get).mockResolvedValue({ data: mockTools })

    const { result } = renderHook(() => useTools(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockTools)
    expect(api.default.get).toHaveBeenCalledWith('/tools/')
  })

  it('deve lidar com erro ao buscar ferramentas', async () => {
    vi.mocked(api.default.get).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useTools(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

