import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRejectRental } from './useRejectRental'
import * as api from '@/lib/api'
import { toast } from 'sonner'

vi.mock('@/lib/api', () => ({
  default: {
    patch: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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

describe('useRejectRental', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve rejeitar aluguel com sucesso', async () => {
    const mockRental = {
      id: 1,
      tool: 1,
      renter: 2,
      start_date: '2024-01-01',
      end_date: '2024-01-05',
      total_price: 200,
      status: 'rejected' as const,
    }

    vi.mocked(api.default.patch).mockResolvedValue({ data: mockRental })

    const { result } = renderHook(() => useRejectRental(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(api.default.patch).toHaveBeenCalledWith('/rentals/1/reject/')
    expect(toast.success).toHaveBeenCalledWith('Aluguel rejeitado com sucesso!')
  })

  it('deve mostrar erro ao falhar rejeição', async () => {
    vi.mocked(api.default.patch).mockRejectedValue({
      response: { data: { detail: 'Erro ao rejeitar' } },
    })

    const { result } = renderHook(() => useRejectRental(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(1)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Erro ao rejeitar')
  })
})

