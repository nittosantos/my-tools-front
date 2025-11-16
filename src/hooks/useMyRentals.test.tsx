import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMyRentals } from './useMyRentals'
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

describe('useMyRentals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    vi.mocked(api.default.get).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMyRentals(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

